import React, { useState } from 'react'
import { message, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import api from '@apis'
import utils from '@utils'

export default function SignUp({ containerRef }) {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false)
    async function handleRegister(e) {
        e.preventDefault();
        try {
            let ipRes = await api.ipApi.getMyIp();

            let newUser = {
                userName: e.target.userName.value,
                email: e.target.email.value,
                password: utils.hash.hashText(e.target.password.value),
                emailConfirm: false,
                role: "member",
                status: "active",
                createAt: String(Date.now()),
                updateAt: String(Date.now()),
                ipList: [
                    ipRes.data.ip
                ],
                avatar: "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg",
            }

            let emailExist = await api.userApi.findByEmailOrUserName(e.target.email.value);
            if (emailExist.status != 200) {
                throw t('err_200')
            } else {
                if (emailExist.data.length > 0) {
                    throw t('err_email')
                }
            }

            let userExist = await api.userApi.findByEmailOrUserName(e.target.userName.value);
            if (userExist.status != 200) {
                throw t('err_200')
            } else {
                if (userExist.data.length > 0) {
                    throw t('err_userName')
                }
            }

            let userRes = await api.userApi.register(newUser);
            if (userRes.status != 201) {
                throw t('err_200')
            }



            let token = utils.token.createToken({
                userId: userRes.data.id,
                time: Date.now()
            })

            // let tokenData = utils.token.decodeToken(token)
            /* Thanh Cong */
            api.mailApi.sendMail({
                to: newUser.email,
                subject: "Xác thực email đăng ký tài khoản mới. (Ya Miêu)",
                content: `
                    <a href="http://localhost:5173/email-confirm?token=${token}">Xác thực</a>
                `
            })
            setLoading(false)
            Modal.confirm({
                title: t('signUp_success'),
                content: t('signUp_howToSignIn'),
                okType: "primary",
                cancelText: t('signUp_no'),
                okText: t('singUp_yes'),
                onOk: () => {
                    containerRef.current.classList.remove("right-panel-active");
                }
            })
        } catch (err) {
            message.error(err)
        }
    }
    return (
        <div className="form-container sign-up-container">
            <form onSubmit={(e) => {
                handleRegister(e);
            }}>
                <span></span>
                <h1>{t('signUp')}</h1>
                <div className="social-container">
                    <a href="#" className="social">
                        <i className="fab fa-facebook-f" />
                    </a>
                    <a href="#" className="social">
                        <i className="fab fa-google-plus-g" />
                    </a>
                    <a href="#" className="social">
                        <i className="fab fa-linkedin-in" />
                    </a>
                </div>
                <span>{t('sign_acc')}</span>
                <input type="text" name='userName' placeholder="User Name" />
                <input type="email" name='email' placeholder="Email" />
                <input type="password" name='password' placeholder="Password" />
                <div onClick={() => {
                    setLoading(true)
                }} className='sign_up_btn'>
                    {
                        loading && <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    }
                    <button type='submit'>{t('signUp')}</button>
                </div>
            </form>
        </div>
    )
}
