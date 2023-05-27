import { Form, useActionData } from 'react-router-dom'
export default function TestUpload() {
  const message = useActionData()
  return (
    <div className="container">
      <div className="h2">Message is: {message}</div>
      <Form method="post" className="form">
        <input type="text" className="form-control" placeholder="User ID" name="userid" required />
        <input type="file" className="form-control" placeholder="Select Photo to Upload" accept="image/png, image/gif, image/jpeg" name="file" required />
        <input type="text" className="form-control" placeholder="What is it for?" name="what" required />
        <button type="submit" className="btn btn-success form-control">Upload File Now!</button>
      </Form>
    </div>
  )
}