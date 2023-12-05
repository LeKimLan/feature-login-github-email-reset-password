import React, { useEffect } from 'react'
import utils from '@utils'
import { Modal } from 'antd';
import api from '@services/apis'
export default function EmailConfirm() {
    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            console.log("token", token)
            let data = utils.token.decodeToken(token.replaceAll(" ", "+"));
            if (data) {
                if ((data.time + (5 * 60 * 1000) < Date.now()) == true) {
                    Modal.error({
                        title: "Mã xác thực hết hạn!"
                    })
                    return
                }
            }

            console.log("da vao")
            api.userApi.update(data.userId,{
                emailConfirm: true
            })
            .then(res => {
                console.log("res", res)
                Modal.success({
                    title: "Xác thực thành công!"
                })
            })
        }catch(err) {
            console.log("err", err)
            Modal.error({
                title: "Mã xác thực hết hạn!"
            })
        }
    }, [])
  return (
    <div style={{color: "black"}}>EmailConfirm</div>
  )
}
