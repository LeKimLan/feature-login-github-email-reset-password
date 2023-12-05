import RouteIndex from './routes/RouteIndex'
import './main.scss'
import './i18n'
import { useEffect } from 'react'
import utils from '@utils'
import { useDispatch } from 'react-redux'
import {userAction} from '@slices/user.slice'
export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if(localStorage.getItem("token")) {
      let data = utils.token.decodeToken(localStorage.getItem("token"));
      if(!data) {
        localStorage.removeItem("token")
        return
      }
      dispatch(userAction.setData(data))
    }
  }, [])
  return (
    <RouteIndex/>
  )
}
