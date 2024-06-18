import './HomePage.scss'
import AppLogo from '../common/AppLogo'
import AppName from '../common/AppName'

export default function HomePage() {
  return (
    <div className='HomePage'>
      <AppLogo size="xlarge" />
      <AppName size="xxlarge" />
    </div>
  )
}