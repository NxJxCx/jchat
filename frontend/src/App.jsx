import { RouterProvider, createBrowserRouter, redirect, json } from 'react-router-dom'
import Swal from 'sweetalert2'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import Chat from './components/Chat/Chat'
import { loginUser, uploadImage } from './api'
import TestUpload from './components/TestUpload'

const router = createBrowserRouter([
  {
    path: '/login',
    exact: true,
    element: <Login />,
    loader: () => {
      const logininfo = window.localStorage.getItem('logininfo')
      return !!logininfo ? redirect('/') : { }
    },
    action: async ({ request }) => {
      const formData = await request.formData()
      const { username, password } = Object.fromEntries(formData)
      try {
        const response = await loginUser(username, password)
        const { error, success } = response.data
        if (error) {
          // error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid username or password',
            timer: 1000
          })
        } else {
          // successful login
          window.localStorage.setItem('logininfo', JSON.stringify({ userid: success.userid, expiresIn: Date.now() + (1000 * 60 * 60) /* 1 hour expiry */ }));
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Logged in successfully',
            timer: 1000
          }).then(() => {
            redirect('/')
          })
        }
      } catch (err) {
        console.log(err)
        // error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again',
          footer: `<strong class="text-danger">${err.message}</strong>`
        })
      }
      return !!window.localStorage.getItem('logininfo');
    }
  },
  {
    path: '/signup',
    exact: true,
    element: <Signup />,
    loader: () => {
      const logininfo = window.localStorage.getItem('logininfo')
      return !!logininfo ? redirect('/') : { }
    }
  },
  {
    path: '/',
    element: <Chat />,
    loader: () => {
      const logininfo = window.localStorage.getItem('logininfo')
      return !logininfo ? redirect('/login') : { logininfo: JSON.parse(logininfo) }
    }
  },
  {
    path: '/testupload',
    element: <TestUpload />,
    action: async ({request}) => {
      const formData = new FormData(document.querySelector('form'))
      try {
        const response = await uploadImage({
          formData,
          forProfile: formData.get('forProfile') === 'profile',
          onUploadProgress: (e) => {
            const percent = Math.floor(Math.max(0, Math.min(100, e.progress / e.total)))
            console.log(percent, "%")
          },
        })
        const result = response.data;
        if (result.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Successfully Uploaded!',
            timer: 1000,
          }).then(() => {
            redirect('/')
          })
        } else if (result.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to upload file!',
            timer: 1000,
          })
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to upload file!',
          footer: `<strong class="text-danger">${error.message}</strong>`
        })
      }
      return {}
    }
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
