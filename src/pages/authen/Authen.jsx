import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import './authen.scss'
import pictures from '@/pictures'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'


export default function Authen() {
    const { t, i18n} = useTranslation();
    const navigate = useNavigate();
    const containerRef = useRef();

    return (
        <div ref={containerRef} className="container" id="container">
            <SignUp containerRef={containerRef} />
            <SignIn />
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>{t ('authen_wellcom')}</h1>
                        <p>{t ('authen_login')}</p>
                        <button onClick={() => {
                            containerRef.current.classList.remove("right-panel-active");
                        }} className="ghost" id="signIn">
                            {t ('authen_signIn')}
                        </button>
                        <button onClick={() => {
                            window.location.href = "/";
                        }} style={{ marginTop: "5px" }} className="ghost">{ t('authen_home')}</button>
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
                    <div className="overlay-panel overlay-right">
                        <h1>{t ('authen_hello')}</h1>
                        <p>{t ('authen_info')}</p>
                        <button onClick={() => {
                            containerRef.current.classList.add("right-panel-active");
                        }} className="ghost" id="signUp">
                            {t('authen_signUp')}
                        </button>
                        <button onClick={() => {
                            window.location.href = "/";
                        }} style={{ marginTop: "5px" }} className="ghost">{ t ('authen_home')}</button>
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
            </div>
        </div>
    )
}
