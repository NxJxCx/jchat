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
              <input type="text" name="username" placeholder="Username" required />
            </label>
            <label className="password" htmlFor="password">
              <input type="password" name="password" placeholder="Password" required/>
            </label>
            <label className="firstname" htmlFor="firstname">
              <input type="text" name="firstname" placeholder="First Name" required />
            </label>
            <label className="middlename" htmlFor="middlename">
              <input type="text" name="middlename" placeholder="Middle Name" />
            </label>
            <label className="lastname" htmlFor="lastname">
              <input type="text" name="lastname" placeholder="Last Name" required />
            </label>
            {/* <!-- Birthday --> */}
            <label className="birthday" htmlFor="birthday">
              <input type="date" name="birthday" placeholder="Birthday" required />
            </label>
            {/* <!-- Gender --> */}
            <label className="gender" htmlFor="gender">
              <select name="gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            {/* <!-- Civil Status --> */}
            <label className="civilstatus" htmlFor="civilstatus">
              <select name="civilstatus">
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
              </select>
            </label>
            <label className="address" htmlFor="address">
              <input type="text" name="address" placeholder="Address" />
            </label>
            <label className="aboutme" htmlFor="aboutme">
              <input type="text" name="aboutme" placeholder="About Me" />
            </label>
            <button className="signup-button">Sign up</button>
          </div>
          <div className="login-content">
            Already have an account? <a href="/login">Login here!</a>
          </div>
        </div>
      </div>
    </Form>
  )
}
