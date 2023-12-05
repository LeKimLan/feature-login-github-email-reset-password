import React, { useEffect, useState } from 'react'
import './header.scss'
import utils from '@utils'
import pictures from '@/pictures'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, signOut } from 'firebase/auth'
import { userAction } from '@slices/user.slice'
import { Modal } from 'antd'
import { signout } from '@/firebase'

export default function Header() {
  const userStore = useSelector(store => store.userStore)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  let token = utils.token.decodeToken(localStorage.getItem('token'))
  
  return (
    <>
      <div className='sup_header'>
        <div className='sup_header_content'>
          {t('globalNav_supHeaderTitle')}.  <pre>   {t('supHeader_cartTitle').replace("*", 5)}</pre>
        </div>
      </div>
      <header>
        <div className='header_content'>
          <div className='left'>
            <div className='logo_box'>
              <img src={pictures.logo} />
            </div>
            <nav>
              {
                [
                  {
                    title: t('globalNav_collection'),
                    children: [
                      {
                        title: "Miền Gió Cát",
                      },
                      {
                        title: "SPEED"
                      },
                      {
                        title: "Di Sản"
                      },
                      {
                        title: "Japanese Horror Stories"
                      },
                      {
                        title: "The Day's Eye"
                      },
                      {
                        title: "Y2010 Nguyên Bản"
                      }
                    ]
                  },
                  {
                    title: t('globalNav_bfdBasic'),
                    children: null
                  },
                  {
                    title: t('globalNav_bfdDesign'),
                    children: [
                      {
                        title: "Áo Thun Outlet"
                      },
                      {
                        title: "Áo Polo Outlet"
                      }
                    ]
                  },
                  {
                    title: t('globalNav_new'),
                    children: null
                  }
                ].map(item => (
                  <div className={`item ${item.children && "sup"}`} key={Date.now() * Math.random()}>
                    {item.title}
                    {
                      item.children && (
                        <div className='sup_menu'>
                          {
                            item.children.map(supItem => (
                              <div key={Date.now() * Math.random()} className='sup_menu_item'>
                                {supItem.title}
                              </div>
                            ))
                          }
                        </div>
                      )
                    }
                  </div>
                ))
              }
            </nav>
          </div>
          <div className='right'>
            <i className="item fa-solid fa-magnifying-glass"></i>
            <i className="item fa-solid fa-bag-shopping"></i>
            {
              userStore.data ? (
                <div className='user_box'>
                  <span>hi {isNaN(Number(userStore.data?.userName)) ? userStore.data?.userName : userStore.data?.email.split('@')[0]}</span>
                  <img src={userStore.data?.avatar} />
                  <button onClick={() => {
                    Modal.confirm({
                      content: "bạn có muốn đăng xuất?",
                      onOk: () => {
                        // const auth = getAuth();
                        // signOut(auth).then(() => {
                        //   // Sign-out successful.
                        // }).catch((error) => {
                        //   console.log("error", error)
                        //   // An error happened.
                        // });
                        dispatch(userAction.removeData())
                        localStorage.removeItem('token')
                      }
                    })
                  }}>X</button>
                </div>
              ) : (
                <div onClick={() => {
                  navigate('/authen')
                }} className='user_authentication'>
                  {t('globalNav_authenTitle')}
                </div>
              )
            }
            <div className='multiple_language'>
              <div onClick={() => {
                localStorage.setItem("locales", "vi")
                i18n.changeLanguage("vi")
              }} className='item'>
                <img src={pictures.flagVN} />
                <span>VN</span>
              </div>
              <div onClick={() => {
                localStorage.setItem("locales", "en")
                i18n.changeLanguage("en")
              }} className='item'>
                <img src={pictures.flagUS} />
                <span>US</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
