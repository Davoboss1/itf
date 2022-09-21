import React from "react";
import { Link } from "wouter";
import Cookies from "js-cookie";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Card from "antd/es/card";
import Alert from "antd/es/alert";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import Select from "antd/es/select";
import Input from "antd/es/input";
import DatePicker from "antd/es/date-picker";
import Table from "antd/es/table";
import Spin from "antd/es/spin";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";

import { ReactComponent as UserAvatar } from "./images/person-circle.svg";
import { PrintContext, HOST } from "./App.js";
import style from "./Design.module.css";

const { Option } = Select;
const { TextArea } = Input;

//Displays bank card payment modal
const BankCardModal = (obj, student, payment_type) => {
  Modal.confirm({
    title: "Make Payment",
    icon: <ExclamationCircleOutlined />,
    content: (
      <div>
        <hr></hr>
        <h6>
          <u>Payer Name</u>
        </h6>
        <h6>{student.full_name}</h6>
        <hr />
        <h6>
          <u>Card Number</u>
        </h6>
        <Input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" />
        <h6 className="mt-10px">
          <u style={{ width: "50%", margin: "10px" }}>Card Expiry Date</u>
          <u style={{ width: "50%", margin: "10px", marginLeft: "15px" }}>
            Card CVV
          </u>
        </h6>
        <div>
          <Input
            type="number"
            placeholder="CVV"
            style={{ width: "40%", margin: "10px" }}
          />
          <Input
            type="text"
            placeholder="05/24"
            style={{ width: "40%", margin: "10px" }}
          />
        </div>
        <h6>
          <u>Payment Type</u>
        </h6>
        <h6>
          {/* render based on item type variable  */}
          {payment_type === "SW" && "Siwes Payment"}
          {payment_type === "IT" && "I.T Payment"}
        </h6>
        <h6>
          <u>Amount</u>
        </h6>
        <h6>
          {/* Render based on item type variable */}
          {payment_type === "SW" && obj.siwes_amount}
          {payment_type === "IT" && obj.it_amount}
          Naira
        </h6>
      </div>
    ),
    okText: "Pay Now",
    okType: "primary",
    cancelText: "Cancel",
    okButtonProps: { id: "confirmButton" },
    onOk(close) {
      Modal.warning({
        title: "Bank Card Information",
        content: "Bank Card Payment Currently not available.",
      });
      close();
    },
    onCancel() {},
  });
};

//Bank Transfer Payment modal
const PaymentModal = (obj, student, payment_type) => {
  Modal.confirm({
    title: "Make Payment",
    icon: <ExclamationCircleOutlined />,
    content: (
      <div>
        <hr></hr>
        <h6>
          <u>Sender Name</u>
        </h6>
        <h6>{student.full_name}</h6>
        <hr />
        <h6>
          <u>Receiver Name</u>
        </h6>
        <h6>{obj.account_name}</h6>

        <h6>
          <u>Payment Type</u>
        </h6>
        <h6>
          {payment_type === "SW" && "Siwes Payment"}
          {payment_type === "IT" && "I.T Payment"}
        </h6>
        <h6>
          <u>Amount</u>
        </h6>
        <h6>
          {payment_type === "SW" && obj.siwes_amount}
          {payment_type === "IT" && obj.it_amount}
          Naira
        </h6>
        <h6>
          <u>Reciever's Bank</u>
        </h6>
        <h6>{obj.account_bank}</h6>
        <h6>
          <u>Account Number</u>
        </h6>
        <h6>{obj.account_number}</h6>
        <hr />
        <small>
          It's recommended to include matric number in payment description for
          easy identification.
        </small>
      </div>
    ),
    okText: "I Have Paid",
    okType: "primary",

    cancelText: "Cancel",

    okButtonProps: { id: "confirmButton" },
    onOk(close) {
      //Get button and set textContent to indicate progress
      let button = document.getElementById("confirmButton");
      button.textContent = "Loading..";

      //Make request to server
      fetch(`${HOST}/log-payment/?authtoken=${Cookies.get("authtoken")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matric_no: student.matric_no,
          payment_type: payment_type,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            //Set button textContent to indicate request success
            button.textContent = "Sent";
            button.disabled = true;

            //Get button and text from dom and set text and disable
            let paybutton = document.getElementById("payNowButton");
            let paymessage = document.getElementById("paynowMessage");
            paybutton.textContent = "Pending";
            paymessage.textContent =
              "Your Payment has been sent and is processing.";
            paybutton.disabled = true;

            //Close modal
            close();
          } else {
            button.textContent = "Failed";
          }
        })
        .catch((error) => {
          button.textContent = "Failed";
        });
    },
    onCancel() {},
  });
};

const setPaymentModal = (obj, student) => {
  let payment_type = "";
  let payment_method = "";
  Modal.info({
    title: "Payment Info",
    closable: true,
    content: (
      <div>
        <h6> Select School</h6>
        <p> {obj.school} </p>
        <h6 className="mt-10">Select Payment Type</h6>
        <Select
          id="payment_type"
          style={{
            width: "100%",
          }}
          onChange={(value: { value: string, label: React.ReactNode }) => {
            payment_type = value;
          }}
        >
          <Option value="SW">Siwes Payment</Option>
          <Option value="IT">I.T Payment</Option>
        </Select>
        <h6 className="mt-10">Select Payment Method</h6>
        <Select
          id="payment_method"
          style={{
            width: "100%",
          }}
          onChange={(value: { value: string, label: React.ReactNode }) => {
            payment_method = value;
          }}
        >
          <Option value="BT">Bank Transfer</Option>
          <Option value="BC">Bank Card</Option>
        </Select>
      </div>
    ),
    okText: "Pay now",
    onOk() {
      if (payment_method === "BC") {
        BankCardModal(obj, student, payment_type);
      } else if (payment_method === "BT") {
        PaymentModal(obj, student, payment_type);
      }
    },
  });
};

//Main student dashboard/page
const StudentDashboard = () => {
  //Load student data from server and update states
  const loadStudent = () => {
    fetch(`${HOST}/student/?authtoken=${Cookies.get("authtoken")}`)
      .then((response) => response.json())
      .then((data) => {
        setStudent(data.student);
        setAccount(data.admin);
        setPayment(data.payment);
        setPaymentMessageData(payment_message_data(data.payment));
        setShowSpin(false);
      })
      .catch((error) => {
        setRequestStatus(errorMessage);
      });
  };

  //Error message on error occuring
  const errorMessage = (
    <div>
      <h6>An error occured</h6>
      <Button type="primary" onClick={loadStudent}>
        Retry
      </Button>
    </div>
  );

  //VAriable declearations e.g states
  const [student, setStudent] = React.useState({});
  const [account, setAccount] = React.useState({});
  const [payment, setPayment] = React.useState([]);
  const [paymentMessageData, setPaymentMessageData] = React.useState([]);
  const [siwesConfirmed, setSiwesConfirmed] = React.useState(false);
  const [itConfirmed, setItConfirmed] = React.useState(false);
  const [itPayment, setItPayment] = React.useState({});
  const [siwesPayment, setSiwesPayment] = React.useState({});
  const [receiptData, setReceiptData] = React.useState({});
  const [showSpin, setShowSpin] = React.useState(true);
  const [requestStatus, setRequestStatus] = React.useState("Fetching Student");
  //Print context/global variable
  const setPrintStudentData = React.useContext(PrintContext);

  //Load student on component mount
  React.useEffect(() => {
    loadStudent();
  }, []);

  //Payment alert
  const payment_message = (message, type, withButton) => (
    <Alert
      message={
        <h6 id="paynowMessage" style={{ margin: 0 }}>
          {message}
        </h6>
      }
      showIcon
      type={type}
      action={
        withButton && (
          <Button
            size="small"
            onClick={() => setPaymentModal(account, student)}
            danger
            id="payNowButton"
          >
            Pay now
          </Button>
        )
      }
    />
  );

  const printReceipts = (data) => {
    //Set student object to print context/global variable
    setPrintStudentData(data);
    //Delay for 1 second to accomodate state update
    setTimeout(() => window.print(), 1000);
  };

  //Display payments alert according to payment type and others
  const payment_message_data = (payment) => {
    let data = [];
    let it_payment_status = false;
    let siwes_payment_status = false;

    //Loop through all payments
    for (var i = 0; i < payment.length; i++) {
      //Get some values from payment objects
      let payment_type = payment[i].payment_type;
      let payment_confirmed = payment[i].confirmed;
      if (payment_confirmed) {
        if (payment_type === "IT Payment") {
          it_payment_status = true;
          setItPayment(payment[i]);
        }
        if (payment_type === "Siwes Payment") {
          siwes_payment_status = true;
          setSiwesPayment(payment[i]);
        }
        data.push(
          payment_message(
            `Your ${payment_type} has been confirmed, You can proceed to print.`,
            "success",
            false
          )
        );
      } else {
        data.push(
          payment_message(
            `Your ${payment_type} has not been confirmed, Please hold for confirmation.`,
            "info",
            false
          )
        );
      }
    }
    setItConfirmed(it_payment_status);
    setSiwesConfirmed(siwes_payment_status);
    return data;
  };

  return (
    <>
      {paymentMessageData}
      {payment.length < 1 &&
        payment_message(
          "You have to make payment to print your reciepts",
          "error",
          true
        )}
      <Spin tip={requestStatus} spinning={showSpin}>
        <div className={style.mainContainer}>
          {payment.length > 0 && (
            <div>
              <Button type="primary" className="button-1 d-inline">
                <Link to="/student-logbook">Logbook</Link>
              </Button>
              {siwesConfirmed && (
                <Button
                  type="primary"
                  onClick={() => printReceipts(siwesPayment)}
                  className="button-1 d-inline ml-10"
                >
                  Print Siwes Receipt
                </Button>
              )}
              {itConfirmed && (
                <Button
                  type="primary"
                  onClick={() => printReceipts(itPayment)}
                  className="button-1 d-inline ml-10"
                >
                  Print I.T Receipt
                </Button>
              )}
            </div>
          )}
          <Row gutter={20}>
            <Col md={12} xs={24}>
              <Card className={style.imageCard}>
                <img src={`${HOST}${student.image}`} alt="Student" />
              </Card>
            </Col>
            <Col md={12} xs={24}>
              <Card
                title={<h5 className="text-white m-0">Personal Information</h5>}
              >
                <p>
                  <h6>Full Name &gt;&gt;&gt; </h6>
                  <h6>{student.full_name}</h6>
                </p>
                <p>
                  <h6>Date of birth &gt;&gt;&gt; </h6>
                  <h6>{student.dob}</h6>
                </p>
                <p>
                  <h6>Email &gt;&gt;&gt; </h6>
                  <h6>{student.email}</h6>
                </p>
                <p>
                  <h6>Phone number &gt;&gt;&gt; </h6>
                  <h6>{student.phone_no}</h6>
                </p>
              </Card>
            </Col>
            <Col md={12} xs={24}>
              <Card
                title={<h5 className="text-white m-0">School Information</h5>}
              >
                <p>
                  <h6>School &gt;&gt;&gt; </h6>
                  <h6>{student.school}</h6>
                </p>
                <p>
                  <h6>Department &gt;&gt;&gt; </h6>
                  <h6>{student.department}</h6>
                </p>
                <p>
                  <h6>Matric No &gt;&gt;&gt; </h6>
                  <h6>{student.matric_no}</h6>
                </p>
                <p>
                  <h6>Program &gt;&gt;&gt; </h6>
                  <h6>{student.program}</h6>
                </p>
              </Card>
            </Col>
            <Col md={12} xs={24}>
              <Card
                title={<h5 className="text-white m-0">Payment Information</h5>}
              >
                <p>
                  <h6>Siwes Payment &gt;&gt;&gt; </h6>
                  <h6>{siwesConfirmed ? "Paid" : "Not Paid"}</h6>
                </p>
                <p>
                  <h6>Siwes Amount &gt;&gt;&gt; </h6>
                  <h6>
                    {siwesPayment.amount
                      ? siwesPayment.amount
                      : account.siwes_amount}{" "}
                    naira
                  </h6>
                </p>
                <p>
                  <h6>I.T Payment &gt;&gt;&gt; </h6>
                  <h6>{itConfirmed ? "Paid" : "Not Paid"}</h6>
                </p>
                <p>
                  <h6>I.T Amount &gt;&gt;&gt; </h6>
                  <h6>
                    {itPayment.amount ? itPayment.amount : account.it_amount}{" "}
                    naira
                  </h6>
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </>
  );
};

//Logbook section

const columns = [
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Description",
    dataIndex: "details",
  },
  {
    title: "Supervisor",
    dataIndex: "supervisor",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
];

const StudentLogbook = (props) => {
  const [requestStatus, setRequestStatus] = React.useState(null);
  const [tableRequestStatus, setTableRequestStatus] =
    React.useState("Fetching Data.");
  const [showSpin, setShowSpin] = React.useState(true);
  const [tableData, setTableData] = React.useState([]);
  const logbookform = React.useRef(null);

  const submitForm = (e) => {
    e.preventDefault();
    let form = e.target;
    let formdata = new FormData(form);
    let formobject = Object.fromEntries(formdata.entries());
    let jsondata = JSON.stringify(formobject);
    setRequestStatus(<Spin className={`d-block ${style.showCenter}`} />);
    fetch(`${HOST}/student-logbook/?authtoken=${Cookies.get("authtoken")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsondata,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setRequestStatus(
            <Alert
              className={style.showCenter}
              message={"Logbook data submitted successfully."}
              showIcon
              type={"success"}
            />
          );

          loadLogbook();
          //Reset form
        } else {
          let keys = Object.keys(data);
          let values = Object.values(data);
          let rendered_data = keys.map((item, index) => {
            return (
              <Alert
                className={style.showCenter}
                style={{ fontSize: "smaller", marginTop: "10px" }}
                message={`${item}: ${values[index]}`}
                showIcon
                type={"error"}
              />
            );
          });
          setRequestStatus(rendered_data);
        }
      })
      .catch((error) => {
        console.log("Error Message");
        setRequestStatus(
          <Alert
            className={style.showCenter}
            style={{ fontSize: "smaller", marginTop: "10px" }}
            message={"Something went wrong, Retry your request."}
            showIcon
            type={"error"}
          />
        );
      });
  };

  const loadLogbook = () => {
    fetch(`${HOST}/student-logbook/?authtoken=${Cookies.get("authtoken")}`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
        setShowSpin(false);
        resetForm();
        //setTimeout(resetForm, 500);
      })
      .catch((error) => {
        setTableRequestStatus("An error occured.");
      });
  };

  const resetForm = () => {
    let form = logbookform.current;
    for (var i = 0; i < form.length; i++) {
      form[i].value = "";
    }
    console.log("form Reseted");
  };

  React.useEffect(() => {
    loadLogbook();
  }, []);

  return (
    <>
      <div className={style.logbookFormContainer}>
        <Row>
          <Col lg={6} md={8} xs={24}>
            <form ref={logbookform} onSubmit={submitForm}>
              <h4 className="text-center">Create Logbook entry</h4>
              <div>
                <label>Title</label>
                <Input placeholder="Title" name="title" required />
              </div>

              <div>
                <label>Supervisor</label>
                <Input placeholder="Supervisor" name="supervisor" required />
              </div>

              <div>
                <label>Date</label>
                <DatePicker className="w-100" name="date" required />
              </div>

              <div>
                <label>Details</label>
                <TextArea
                  showCount
                  maxLength={100}
                  name="details"
                  required
                  style={{ height: 120 }}
                />
              </div>
              <Button
                type="ghost"
                htmlType="submit"
                className="w-100 mt-10 mb-10"
              >
                {" "}
                Submit
              </Button>
              {requestStatus}
            </form>
          </Col>
          <Col
            lg={{ span: 15, offset: 1 }}
            md={{ span: 15, offset: 1 }}
            xs={24}
          >
            <Spin tip={tableRequestStatus} spinning={showSpin}>
              <h5 className="text-center mt-10">LogBook</h5>
              <Table
                columns={columns}
                rowSelection={null}
                dataSource={tableData}
                onChange={null}
                style={{ padding: "10px" }}
              />
            </Spin>
          </Col>
        </Row>
      </div>
    </>
  );
};

export { StudentDashboard, StudentLogbook };
