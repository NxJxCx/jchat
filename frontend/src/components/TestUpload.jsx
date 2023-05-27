import { Form, useActionData } from 'react-router-dom'
export default function TestUpload() {

  return (
    <div className="container">
      <Form method="post" enctype="multipart/form-data" className="form">
        <input type="text" className="form-control" placeholder="User ID" name="userid" required />
        <input type="file" id="photofile" className="form-control" placeholder="Select Photo to Upload" accept="image/png, image/gif, image/jpeg" name="file" required />
        <input type="text" className="form-control" placeholder="What is it for?" name="what" required />
        <button type="submit" className="btn btn-success form-control">Upload File Now!</button>
      </Form>
    </div>
  )
}