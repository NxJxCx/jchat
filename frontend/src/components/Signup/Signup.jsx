import { Form } from 'react-router-dom'
import './Signup.css'
// import Checkbox from '../Checkbox/Checkbox'

export default function Signup() {
  return (
    <Form method="post">
      <div className="signup-container">
        <div  className="signup-box shadow">
          <h2>Sign up!</h2>
          <div className="text-secondary">Welcome to J's Chat.</div>
          <div className="signup-form">
            <label className="username" htmlFor="username">
              <span></span>
              <input type="text" name="username" placeholder="Username" required />
            </label>
            <label className="password" htmlFor="password">
              <span></span>
              <input type="password" name="password" placeholder="Password" required/>
            </label>
            <label className="firstname" htmlFor="firstname">
              <span></span>
              <input type="text" name="firstname" placeholder="First Name" required />
            </label>
            <label className="middlename" htmlFor="middlename">
              <span></span>
              <input type="text" name="middlename" placeholder="Middle Name" />
            </label>
            <label className="lastname" htmlFor="lastname">
              <span></span>
              <input type="text" name="lastname" placeholder="Last Name" required />
            </label>
            {/* <!-- Birthday --> */}
            {/* <!-- Gender --> */}
            {/* <!-- --> */}
            <label className="" htmlFor="username">
              <span></span>
              <input type="text" name="username" placeholder="Username" required />
            </label>

            <button className="signup-button">Sign up</button>
          </div>
          <hr />
          <div className="login-content">
            Already have an account? <a href="/login">Login here!</a>
          </div>
        </div>
      </div>
    </Form>
  )
}
