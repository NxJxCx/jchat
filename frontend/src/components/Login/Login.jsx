import { Form } from 'react-router-dom'
import './Login.css'

export default function Login() {
  return (
    <Form method="post">
      <div className="login-container">
        <div  className="login-box shadow">
          <h2>Log in!</h2>
          <div className="text-secondary">Welcome to J's Chat.</div>
          <div className="login-form">
            <label className="username" htmlFor="username">
              <span></span>
              <input type="text" name="username" placeholder="Username" required />
            </label>
            <label className="password" htmlFor="password">
              <span></span>
              <input type="password" name="password" placeholder="Password" required/>
            </label>
            <div className="checkbox-group" type="button" onClick={(e)=>{const children = [...e.target.children]; if (children.length > 0) children[0].checked = !children[0].checked;}}><input type="checkbox" name="rememberme" /> Remember me</div>
            <button className="login-button">Log in</button>
          </div>
          <div className="register-content">
            New user? <a href="/register">Register here!</a>
          </div>
        </div>
      </div>
    </Form>
  )
}
