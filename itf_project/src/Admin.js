import Row from "antd/es/row";
import Col from "antd/es/col";
import Card from "antd/es/card";
import Modal from "antd/es/modal";
import Table from "antd/es/table";
import Input from "antd/es/input";
import Button from "antd/es/button";
import Tag from "antd/es/tag";
import Spin from "antd/es/spin";
import Message from "antd/es/message";
import style from "./Design.module.css";
import React from "react";
import { useLocation } from "wouter";
import Cookies from "js-cookie";
import { HOST, PrintContext } from "./App.js";

//Student table columns object
const columns = [
  {
    title: "Student Name",
    dataIndex: "student",
    key: "student",
    render: (name) => `${name.full_name}`,
  },
  {
    title: "Matric Number",
    dataIndex: "student",
    key: "student",
    render: (name) => `${name.matric_no}`,
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: "Date and Time",
    dataIndex: "created_at_format",
    key: "created_at_format",
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
  {
    title: "Payment Confirmed",
    dataIndex: "confirmed",
    key: "confirmed",
    render: (confirmed) => {
      if (confirmed) {
        return <Tag color="#3b5999">Yes</Tag>;
      } else {
        return <Tag color="#cd201f">No</Tag>;
      }
    },
  },
  {
    title: "Payment Type",
    dataIndex: "payment_type",
    key: "payment_type",
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
];

//On table change
const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

//Stores cuurently selected rows
var currentSelectedRows;

//Event listener on table row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    currentSelectedRows = selectedRows;
  },
};

//Main admin dashboard/page component
const AdminDashboard = () => {
  //Top level declearations for components
  const setPaymentForm = React.useRef(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [admin, setAdmin] = React.useState({});
  const [showSpin, setShowSpin] = React.useState(true);
  const [tableData, setTableData] = React.useState([]);
  const [requestStatus, setRequestStatus] = React.useState(
    "Fetching Information"
  );
  const [location, setLocation] = useLocation("");
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  //Token stored in browser/cookies to detect authenticated user
  const authtoken = Cookies.get("authtoken");
  //Sets payment data
  const setPayment = (e) => {
    let button = e.target;
    //Get form from ref
    let form = setPaymentForm.current;
    if (!form.reportValidity()) {
      return;
    }
    //Change button text to indicate progress
    button.textContent = "Setting...";

    //Using formdata get form data
    let formdata = new FormData(form);
    //Convert formdata object to normal js object
    let formobject = Object.fromEntries(formdata.entries());
    //Convert to json
    let data = JSON.stringify(formobject);
    //Make http request to set payment information
    fetch(`${HOST}/set-payment/?authtoken=${Cookies.get("authtoken")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => {
        //Http response handling
        if (response.status === 200) {
          button.textContent = "Set";
          setIsModalVisible(false);
          form.reset();
        } else {
          button.textContent = "Error";
        }
      })
      .catch((error) => {
        //Http request failure
        button.textContent = "Failed";
      });
  };

  //Loads Admin data into template
  const loadAdmin = () => {
    fetch(`${HOST}/get_admin/?authtoken=${Cookies.get("authtoken")}`)
      .then((response) => response.json())
      .then((data) => {
        setAdmin(data);
        setShowSpin(false);
      })
      .catch((error) => {
        setRequestStatus(errorMessage);
      });
  };

  //Load payments data into templates
  const loadPayments = () => {
    fetch(`${HOST}/get_pending_payments/?authtoken=${Cookies.get("authtoken")}`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
      })
      .catch((error) => {});
  };

  //Error message for when request to server fails
  const errorMessage = (
    <div>
      <h6>An error occured</h6>
      <Button type="primary" onClick={loadAdmin}>
        Retry
      </Button>
    </div>
  );

  //React effects to fetch all data for page when component is mounted
  React.useEffect(() => {
    console.log("User token" + Cookies.get("authtoken"));
    loadPayments();
    loadAdmin();
  }, []);

  //Confirm Payment onClick event handler
  //Handles both confirm and revoke payment actions
  const confirmRevokePayment = (event, confirm) => {
    let button = event.target;
    let url;
    let text;
    //On confirm send request to different urls 
    if (confirm) {
      button.textContent = "Confirming...";
      url = `${HOST}/confirm-payment/?authtoken=${Cookies.get("authtoken")}`;
      text = "Confirm Payment";
    } else {
      button.textContent = "Revoking...";
      url = `${HOST}/revoke-payment/?authtoken=${Cookies.get("authtoken")}`;
      text = "Revoke Payment";
    }

    //Http request
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentSelectedRows),
    })
      .then((response) => {
        //Http response handling
        if (response.status === 200) {
          button.textContent = text;
          loadPayments();
        } else {
          button.textContent = "Error";
        }
      })
      .catch((error) => {
        button.textContent = "Failed";
      });
  };

  //Context/Global variable used for setting student data to print
  const setPrintStudentData = React.useContext(PrintContext);

  const printReceipts = (e) => {
    //Check if allowed to print
    if (currentSelectedRows.length > 1) {
      Message.error("Please select one student");
      return;
    }
    if (!currentSelectedRows[0].confirmed) {
      Message.error(
        "Student payment not confirmed. Please confirm payment to print."
      );
      return;
    }
    let data = currentSelectedRows[0];
    //Set student to print
    setPrintStudentData(data);
    //Delay for 1 seconds to accomodate the state update
    setTimeout(() => window.print(), 1000);
  };

  //View logbook
  const viewLogbook = (e) => {
    //Perform checks
    if (currentSelectedRows.length > 1) {
      Message.error("Please select one student");
      return;
    }
    if (!currentSelectedRows[0].confirmed) {
      Message.error(
        "Student payment not confirmed. Please confirm payment to proceed."
      );
      return;
    }
    //Get studentobject and change page location
    let data = currentSelectedRows[0];
    let matric_no = data.student.matric_no;
    setLocation("/get-student-logbook/" + matric_no);
  };

  //Rendered data
  return (
    <Spin spinning={showSpin} tip={requestStatus}>
      <div className={style.mainContainer}>
        <div>
          <Button
            type="primary"
            className="button-1 d-inline"
            onClick={showModal}
          >
            Set Payment Information
          </Button>
        </div>
        <Row gutter={20}>
          <Col md={12} xs={24}>
            <Card
              title={<h5 className="text-white m-0">Personal Information</h5>}
            >
              <p>
                <h6>UserName &gt;&gt;&gt; </h6>
                <h6>{admin.username}</h6>
              </p>
              <p>
                <h6>Full name &gt;&gt;&gt; </h6>
                <h6>
                  {admin.first_name} {admin.last_name}
                </h6>
              </p>
              <p>
                <h6>Email &gt;&gt;&gt; </h6>
                <h6>{admin.email}</h6>
              </p>
              <p>
                <h6>School &gt;&gt;&gt; </h6>
                <h6>{admin.school}</h6>
              </p>
            </Card>
          </Col>
          <Col md={12} xs={24}>
            <Card
              title={<h5 className="text-white m-0">Account Information</h5>}
            >
              <p>
                <h6>Account name &gt;&gt;&gt; </h6>
                <h6>{admin.account_name}</h6>
              </p>
              <p>
                <h6>Account Number &gt;&gt;&gt; </h6>
                <h6>{admin.account_number}</h6>
              </p>
              <p>
                <h6>Bank &gt;&gt;&gt; </h6>
                <h6>{admin.account_bank}</h6>
              </p>
              <p>
                <h6>Siwes Amount &gt;&gt;&gt; </h6>
                <h6>{admin.siwes_amount}</h6>
              </p>
              <p>
                <h6>I.T Amount &gt;&gt;&gt; </h6>
                <h6>{admin.it_amount}</h6>
              </p>
            </Card>
          </Col>
        </Row>
      </div>
      <div className={style.tableContainer}>
        <div
          className="d-flex"
          style={{ justifyContent: "space-between", width: "780px" }}
        >
          <h4 className="v-center">Paid/Pending Students</h4>
          <div>
            <Button
              type="primary"
              className="button-1 d-inline ml-10"
              onClick={(e) => confirmRevokePayment(e, true)}
            >
              Confirm Payment
            </Button>
            <Button
              type="primary"
              className="button-1 d-inline ml-10"
              onClick={(e) => confirmRevokePayment(e, false)}
            >
              Revoke Payment
            </Button>
            <Button
              type="primary"
              className="button-1 d-inline ml-10"
              onClick={viewLogbook}
            >
              View LogBook
            </Button>
            <Button type="primary" className="ml-10" onClick={printReceipts}>
              Print Receipts
            </Button>
          </div>
        </div>
        <Table
          style={{ minWidth: "600px", width: "100%" }}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={tableData}
          onChange={onChange}
        />
        ;
      </div>

      <Modal
        title="Set Payment"
        visible={isModalVisible}
        onOk={setPayment}
        okText={"Set"}
        onCancel={handleCancel}
        width={400}
      >
        <form ref={setPaymentForm}>
          <h5>Set account information {admin.school}</h5>
          <div className="mt-10">
            <label>Account Name</label>
            <Input name="acct-name" placeholder="Account Name" required />
          </div>
          <div className="mt-10">
            <label>Account Number</label>
            <Input
              placeholder="0123456789"
              name="acct-number"
              type="number"
              required
            />
          </div>
          <div className="mt-10">
            <label>Bank</label>
            <Input placeholder="Bank name" name="bank-name" required />
          </div>
          <div className="mt-10">
            <label>Siwes Amount</label>
            <Input placeholder="Siwes Amount" name="siwes-amount" required />
          </div>
          <div className="mt-10">
            <label>I.T Amount</label>
            <Input placeholder="I.T Amount" name="it-amount" required />
          </div>
        </form>
      </Modal>
    </Spin>
  );
};

//Logbook section
const logbook_columns = [
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

const AdminStudentLogbook = (props) => {
  //Variable declarations
  const [tableRequestStatus, setTableRequestStatus] =
  React.useState("Fetching Data.");
  const [showSpin, setShowSpin] = React.useState(true);
  const [tableData, setTableData] = React.useState([]);
  const [student, setStudent] = React.useState({});

  const loadLogbook = () => {
    fetch(
      `${HOST}/get-student-logbook/${props.matric_no}/?authtoken=${Cookies.get(
        "authtoken"
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setStudent(data.student);
        setTableData(data.logbook);
        setShowSpin(false);
      })
      .catch((error) => {
        setTableRequestStatus("An error occured.");
      });
  };

  React.useEffect(() => {
    loadLogbook();
  }, []);
  return (
    <div style={{ margin: "5%" }}>
      <Spin tip={tableRequestStatus} spinning={showSpin}>
        <h2 className="text-center mt-10">{student.name}</h2>
        <h2 className="text-center mt-10">Matric No: {student.matric_no}</h2>
        <h2 className="text-center mt-10">LogBook</h2>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: "600px", width: "100%" }}>
            <Table
              columns={logbook_columns}
              rowSelection={null}
              dataSource={tableData}
              onChange={null}
              style={{ padding: "10px" }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export { AdminDashboard, AdminStudentLogbook };
