

import React, { useEffect } from 'react'
import utils from '@utils'
import { Modal } from 'antd';
import api from '@services/apis'

export default function ResetPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  let data = utils.token.decodeToken(token.replaceAll(" ", "+"));
  console.log("data",data)
  useEffect(() => {
    try {
      // const urlParams = new URLSearchParams(window.location.search);
      // const token = urlParams.get('token');
      // let data = utils.token.decodeToken(token.replaceAll(" ", "+"));
      if (data) {
        api.userApi.update(data.userId, {
          password: utils.hash.hashText(data.newPassword)
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  return (
    <div style={{ color: "black" }}>Mật khẩu mới là {data.newPassword}</div>
  )
}
