import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { message, Modal } from 'antd'
import api from '@apis'
import utils from '@utils'
import { loginWithGoogle } from '@/firebase.js'
import { loginWithGithub } from '@/firebase.js'
import { useNavigate } from 'react-router-dom'
import { getAuth, linkWithPopup, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, linkWithCredential } from "firebase/auth";

export default function SignIn() {
    const { t, i18n } = useTranslation();
    const [forgotPasswordForm, setForgotPasswordForm] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    async function handleLogin(e) {
        e.preventDefault();
        try {
            /*
                Input: userName / email + password => Search db.json ...
                Output: false => notication, true => token => save to local storage
            */
            let data = {
                loginId: e.target.loginId.value,
                password: e.target.password.value
            }

            /* Kiểm tra xem user có tồn tại hay chưa => có => data user, không => err */
            let userRes = await api.userApi.findByEmailOrUserName(data.loginId); // => array [], [user]
            if (userRes.status != 200) {
                throw t('err_200')
            } else {
                if (userRes.data.length == 0) {
                    throw "Người dùng không tồn tai!"
                }
            }
            let user = userRes.data[0];
            /*  Tìm thấy  => check password*/
            if (utils.hash.hashText(data.password) != user.password) {
                throw "mat khau khong chinh xac"
            }

            /* Kiem tra IP login */
            let ipRes = await api.ipApi.getMyIp();
            let ip = ipRes.data.ip;

            if (!user.ipList.find(item => item == ip)) {
                let token = utils.token.createToken({
                    userId: user.id,
                    newIpList: [...user.ipList, ip],
                    time: Date.now()
                })

                api.mailApi.sendMail({
                    to: user.email,
                    subject: "Xác thực ip login mới. (Ya Miêu)",
                    content: `
                        <p>Chúng tôi nhận thấy bạn đang đăng nhập tại vị trí có IP là: ${ip}</p>
                        <p>Nếu thật sự là bạn, hãy bấm vào nút bên dưới để xác nhận và tiến hành đăng nhập lại.</p>
                        <a href="http://localhost:5173/set-ip?token=${token}">Add New Ip</a>
                    `
                })
                throw "Bạn đang đăng nhập ở một vị trí mới, vui lòng vào email xác thực!"
            }

            /* thanh cong */

            localStorage.setItem("token", utils.token.createToken(user))

            setLoading(false)
            Modal.success({
                content: "login thanh cong",
                onOk: () => {
                    window.location.href = '/'
                }
            })
        } catch (err) {
            message.error(err)
        }
    }

    async function handleResetPassword(event) {
        try {
            event.preventDefault();
            let resetEmail = event.target.resetEmail.value;

            let userRes = await api.userApi.findByEmailOrUserName(resetEmail);
            let user = userRes.data[0];
            if (user) {
                // let newPassword = Math.floor(100000 + Math.random() * 900000)
                let token = utils.token.createToken({
                    userId: user.id,
                    newPassword: Math.floor(100000 + Math.random() * 900000),
                })
                // console.log('result', token)
                api.mailApi.sendMail({
                    to: resetEmail,
                    subject: "Thông báo reset mật khẩu",
                    content: `
                                          <p>Có phải bạn vừa thông báo quên mật khẩu?</p>
                                          <p>Nếu đúng thì hãy nhấn vào link dưới đây để tiến hành đổi.</p>
                                          <p>Không thì coi chừng bay acc</p>
                                          <a href="http://localhost:5173/reset-password?token=${token}">Reset</a>
                                      `
                })

            }
            else {
                alert('email không tồn tại trong hệ thống')
            }
            setForgotPasswordForm(false);
        } catch (error) {
            console.log("error", error)
        }

    }

    async function handleLoginWithGithub() {
        try {
            let result = await loginWithGithub();

            let userRes = await api.userApi.findByEmailOrUserName(result.user.email);
            if (userRes.status != 200) {
                throw t('err_200')
            } else {
                if (userRes.data.length == 0) {
                    let newUser = {
                        userName: String(Math.ceil(Date.now() * Math.random())),
                        email: result.user.providerData[0].email,
                        password: utils.hash.hashText(String(Math.ceil(Date.now() * Math.random()))),
                        emailConfirm: true,
                        role: "member",
                        status: "active",
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        ipList: [],
                        avatar: result.user.photoURL,
                    }
                    let newUserRes = await api.userApi.register(newUser);
                    if (newUserRes.status != 201) {
                        throw t('err_200')
                    }
                    localStorage.setItem("token", utils.token.createToken(newUserRes.data))
                    setLoading(false)
                    Modal.success({
                        content: "login thanh cong",
                        onOk: () => {
                            window.location.href = '/'
                        }
                    })
                    return
                }
            }
            let user = userRes.data[0];
            localStorage.setItem("token", utils.token.createToken(user))
            setLoading(false)
            Modal.success({
                content: "login thanh cong",
                onOk: () => {
                    window.location.href = '/'
                }
            })
        } catch (error) {
            if (error.code === "auth/account-exists-with-different-credential") {
                setLoading(false)
                Modal.confirm({
                    content: "Tài khoản có địa chỉ email với trùng với phương thức đăng nhập Google. Bạn có muốn liên kết với tài khoản Google không?",
                    onOk: () => {
                        linkWithGoogle()
                    }
                })
            }
        }
    }
        // dời code linkWithGoogle qua trang firebase.js
    async function linkWithGoogle() {
        try {
            let provider = new GithubAuthProvider();
            const auth = getAuth();
            let current = auth.currentUser;
            linkWithPopup(auth.currentUser, provider).then((result) => {
                setLoading(false)
                Modal.success({
                    content: "Liên kết thành công",
                    onOk: () => {
                        handleLoginWithGoogle()
                    }
                })
            }).catch(error => console.log('error', error))
        } catch (error) {
            console.log("error", error)
        }
    }

    async function handleLoginWithGoogle() {
        try {
            let result = await loginWithGoogle();
            let userRes = await api.userApi.findByEmailOrUserName(result.user.email); // => array [], [user]
            if (userRes.status != 200) {
                throw t('err_200')
            } else {
                if (userRes.data.length == 0) {
                    let newUser = {
                        userName: String(Math.ceil(Date.now() * Math.random())),
                        email: result.user.email,
                        password: utils.hash.hashText(String(Math.ceil(Date.now() * Math.random()))),
                        emailConfirm: true,
                        role: "member",
                        status: "active",
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        ipList: [],
                        avatar: result.user.photoURL,
                    }
                    let newUserRes = await api.userApi.register(newUser);
                    if (newUserRes.status != 201) {
                        throw t('err_200')
                    }
                    localStorage.setItem("token", utils.token.createToken(newUserRes.data))
                    setLoading(false)
                    Modal.success({
                        content: "login thanh cong",
                        onOk: () => {
                            window.location.href = '/'
                        }
                    })
                    return
                }
            }
            // da ton tai trong he thong
            let user = userRes.data[0];
            localStorage.setItem("token", utils.token.createToken(user))
            setLoading(false)
            Modal.success({
                content: "login thanh cong",
                onOk: () => {
                    window.location.href = '/'
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className="form-container sign-in-container">
                {
                    forgotPasswordForm && <div className='forgot-password-form'>
                        <form onSubmit={() => {
                            handleResetPassword(event)
                        }}>
                            <p>Please enter your email</p>
                            <input type="text" name='resetEmail' />
                            <button className='reset-btn' type='submit' >
                                Reset
                            </button>
                        </form>
                        <button className='close-btn' type='button' onClick={() => {
                            setForgotPasswordForm(false)
                        }}>X</button>
                    </div>
                }
                <form onSubmit={(e) => {
                    handleLogin(e)
                }}>
                    <h1>{t('signIn')}</h1>
                    <div className="social-container">
                        <a href="#" className="social">
                            <i className="fab fa-facebook-f" />
                        </a>
                        <a onClick={() => {
                            handleLoginWithGoogle()
                        }} className="social">
                            <i className="fab fa-google-plus-g" />
                        </a>
                        <a onClick={() => {
                            handleLoginWithGithub()
                        }} href="#" className="social">
                            <i className="fab fa-github" />
                        </a>
                    </div>
                    <span>{t('signIn_acc')}</span>
                    <input type="text" placeholder="username/email" name='loginId' />
                    <input type="password" placeholder="Password" name='password' />
                    <div className='forgot-password' onClick={() => {
                        setForgotPasswordForm(true)
                    }}>{t('signIn_password')}</div>
                    
                    <div onClick={() => {
                        setLoading(true)
                    }} className='sign_up_btn'>
                        {
                            loading && <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        }
                        <button type='submit'>{t('signIn')}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
