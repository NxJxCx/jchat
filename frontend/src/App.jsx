import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
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
      const progressbar = document.querySelector('progress#file')
      progressbar.value = 0
      progressbar.innerHTML = " 0% "
      progressbar.classList.remove('d-none')
      const formData = await request.formData()
      try {
        const response = await uploadImage({
          formData,
          forProfile: formData.get('forProfile') === 'profile',
          onUploadProgress: (e) => {
            progressbar.max = e.total
            progressbar.value = e.loaded
            progressbar.innerHTML = ` ${Math.floor(e.progress * 100)}% `
          }
        })
        const result = response.data;
        if (result.success) {
          console.log(result.success)
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: result.success.message,
            timer: 1000,
          }).then(() => {
            redirect('/')
          })
        } else if (result.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.error.message,
            timer: 1000,
          })
        }
      } catch (error) {
        console.log(error)
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
