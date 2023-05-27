import { Form, useActionData } from 'react-router-dom'
export default function TestUpload() {

  return (
    <div className="container">
      <Form method="post" enctype="multipart/form-data" className="form">
        <input type="text" className="form-control" placeholder="User ID" name="userid" required />
        <input type="file" className="form-control" placeholder="Select Photo to Upload" accept="image/png, image/gif, image/jpeg" name="photo" required />
        <input type="text" className="form-control" placeholder="What is it for?" name="forProfile" required />
        <button type="submit" className="btn btn-success form-control">Upload File Now!</button>
      </Form>
      <div className="text-success">
      <progress className="d-none" id="file" value="0" max="100"> 0% </progress>
      </div>
    </div>
  )
}