import React from "react";
import Cookies from "js-cookie";
import { useLocation } from "wouter";
import Input from "antd/es/input";
import Spin from "antd/es/spin";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Alert from "antd/es/alert";
import Message from "antd/es/message";
import style from "./Form.module.css";
import { ReactComponent as UserAvatar } from "./images/person-circle.svg";
import avatarUser from "./images/person-circle.svg";
import { HOST } from "./App.js";

//Student signup form component
const SignupForm = (props) => {
  //component definitions e.g states, etc
  const [message, setMessage] = React.useState("");
  const [schools, setSchools] = React.useState([]);
  const [location, setLocation] = useLocation("");

  //Fetch school information on component load
  React.useEffect(() => {
    fetch(`${HOST}/get_school/`)
      .then((response) => response.json())
      .then((data) => {
        setSchools(data);
      })
      .catch((error) => {});
  }, []);
  
  
  const previewImage = (e) => {
    let fileElem = e.target;
    let file = fileElem.files[0];
    //Check uploaded file size and throw message if too large
    if (file.size >= 2000000) {
      Message.error("File Size too large.");
      return;
    }
    //Preview Image
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const uploaded_image = reader.result;
      document.getElementById("mainImage").src = uploaded_image;
      document.querySelector("input[type=file]").name = "image";
    });
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <>
      <form
        className={style.Form}
        onSubmit={(e) => {
          e.preventDefault();
          setMessage(<Spin className={`d-block ${style.showCenter}`} />);
          postForm(
            e.target,
            `${HOST}/student-register/`,
            action,
            setMessage,
            setLocation,
            "/student-dashboard"
          );
        }}
      >
        <Row>
          <Col md={24}>
            <h5 className="badge-1">Student Register Form</h5>
          </Col>
          <Col md={24} className={style.AvatarContainer}>
            <img id="mainImage" src={avatarUser} className={style.userAvatar} />
            <input
              name="image"
              accept="image/*"
              style={{ width: "89px" }}
              onChange={previewImage}
              type="file"
            />
          </Col>
          <Col sm={24} md={12}>
            <h6>Full Name</h6>
            <Input
              name="full_name"
              type="text"
              placeholder="Full Name"
              required
            />
          </Col>
          <Col sm={24} md={12}>
            <h6>Email Address</h6>
            <Input name="email" type="email" placeholder="E-mail" required />
          </Col>
          <Col sm={24} md={12}>
            <h6>Date of birth</h6>
            <Input name="dob" type="date" placeholder="Date" required />
          </Col>
          <Col sm={24} md={12}>
            <h6>Phone no</h6>
            <Input name="phone_no" type="tel" placeholder="Phone No" required />
          </Col>
          <Col sm={24} md={12}>
            <h6>School</h6>
            <select name="school">
              <option value="">Select School</option>
              {schools.map((school) => (
                <option>{school}</option>
              ))}
            </select>
          </Col>
          <Col sm={24} md={12}>
            <h6>Matric No</h6>
            <Input
              name="matric_no"
              type="number"
              placeholder="Matric No"
              required
            />
          </Col>
          <Col sm={24} md={12}>
            <h6>Department</h6>
            <Input
              name="department"
              type="text"
              placeholder="Department"
              required
            />
          </Col>
          <Col sm={24} md={12}>
            <h6>Faculty</h6>
            <Input name="faculty" type="text" placeholder="Faculty" required />
          </Col>
          <Col sm={24} md={12}>
            <h6>Program</h6>
            <Input
              placeholder="Program"
              name="program"
              type="program"
              required
            />
          </Col>
          <Col sm={24} md={12}>
            <h6>Level</h6>
            <Input placeholder="Level" name="level" type="text" required />
          </Col>
          <Col sm={24} md={12}>
            <h6>Password</h6>
            <Input
              placeholder="Password"
              name="password"
              type="password"
              required
            />
          </Col>
          <Col sm={24} md={12}>
            <h6>Confirm Password</h6>
            <Input
              placeholder="Confirm password"
              type="password"
              required
              onChange={(e) => {
                //Compare password fields to see if they match
                let elem = e.target;
                let current_value = elem.value;

                //Traverse the dom and find first password field and get the value
                let other_value =
                  elem.parentElement.previousElementSibling.lastElementChild
                    .value;

                let button =
                  elem.parentElement.nextElementSibling.firstElementChild;
                let password_error_elem = elem.nextElementSibling;
                if (current_value === other_value) {
                  password_error_elem.innerHTML = "";
                  button.disabled = false;
                } else {
                  password_error_elem.innerHTML = "passwords don't match";
                  button.disabled = true;
                }
              }}
            />
            <p style={{ color: "red" }}></p>
          </Col>
          <Col md={24}>
            <Button
              type="primary"
              htmlType="submit"
              className={`button-1 ${style.showCenter}`}
            >
              Submit
            </Button>
          </Col>
          <Col md={24}>{message}</Col>
        </Row>
      </form>
    </>
  );
};

//Component for login forms
const LoginTemplate = (props) => {

  const [message, setMessage] = React.useState("");
  const [location, setLocation] = useLocation("");

  return (
    <form
      className={style.Form}
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(<Spin className={`d-block ${style.showCenter}`} />);
        postForm(
          e.target,
          props.requestInfo.url,
          action,
          setMessage,
          setLocation,
          props.requestInfo.redirect_url
        );
      }}
    >
      <Row className={style.row}>
        <Col md={24}>
          <h5 className="badge-1">{props.text} Login</h5>
        </Col>
        <Col md={24}>
          <UserAvatar className={`${style.userAvatar} d-block mx-auto`} />
        </Col>
        <Col sm={24} className={style.LoginInputContainer}>
          {props.text === "Admin" ? (
            <>
              <h6>Username</h6>
              <Input name="username" placeholder="Username" required />
            </>
          ) : (
            <>
              <h6>Matric Number</h6>
              <Input
                name="matric-no"
                type="number"
                placeholder="Matric number"
                required
              />
            </>
          )}
        </Col>
        <Col sm={24} className={style.LoginInputContainer}>
          <h6>Password</h6>
          <Input
            name="password"
            type={"password"}
            placeholder="Password"
            required
          />
        </Col>

        <Col md={24}>
          <Button
            type="primary"
            htmlType="submit"
            className={`button-1 ${style.showCenter}`}
          >
            Submit
          </Button>
        </Col>
        <Col md={24}>{message}</Col>
      </Row>
    </form>
  );
};

const StudentLoginForm = (props) => {
  return (
    <>
      <LoginTemplate
        text="Student"
        requestInfo={{
          url: `${HOST}/student-login/`,
          redirect_url: "/student-dashboard",
        }}
      />
    </>
  );
};

const status = {
  SUCCESS: 1,
  FAILURE: 2,
  SERVERERROR: 3,
};

const action = (
  actionStatus,
  setMessage,
  message = "",
  setLocation = null,
  location = ""
) => {
  let type = "";
  switch (actionStatus) {
    case status.FAILURE:
      message = "Your request failed please try again";
      type = "error";
      break;
    case status.SERVERERROR:
      type = "error";
      break;
    case status.SUCCESS:
      message = "Your request was successful";
      type = "success";
      setLocation(location);
      break;
    default:
      message = "An unknown error occured";
      type = "error";
      break;
  }
  setMessage(
    <Alert
      className={style.showCenter}
      message={message}
      showIcon
      type={type}
    />
  );
};

const postForm = (form, url, action, setMessage, setLocation, location) => {
  let formdata = new FormData(form);
  let formobject = Object.fromEntries(formdata.entries());
  //let data = JSON.stringify(formobject);

  fetch(url, {
    method: "POST",
    body: formdata,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.authtoken) {
        Cookies.set("authtoken", data.authtoken);
        action(status.SUCCESS, setMessage, "", setLocation, location);
      } else if (data.errorMessage) {
        action(status.SERVERERROR, setMessage, data.errorMessage);
      } else {
        action(
          status.SERVERERROR,
          setMessage,
          "An unknown server error occured"
        );
      }
    })
    .catch((error) => {
      console.log("Loggin error");
      action(status.FAILURE, setMessage);
    });
};

const LoginForm = (props) => {
  return (
    <>
      <LoginTemplate
        text="Admin"
        requestInfo={{
          url: `${HOST}/login/`,
          redirect_url: "/admin-dashboard",
        }}
      />
    </>
  );
};

export { SignupForm, StudentLoginForm, LoginForm };
