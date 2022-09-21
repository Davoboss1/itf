import { Link, Route } from "wouter";
import React from "react";

import Layout from "antd/es/layout";
import Button from "antd/es/button";
import Menu from "antd/es/menu";
import Dropdown from "antd/es/dropdown";
import Card from "antd/es/card";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Tag from "antd/es/tag";

//Icons import
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import UserAddOutlined from "@ant-design/icons/UserAddOutlined";
import LinkOutlined from "@ant-design/icons/LinkOutlined";
import ContactsOutlined from "@ant-design/icons/ContactsOutlined";
//import {Layout, Button} from 'antd';
import "antd/dist/antd.css";
import "./App.css";

import { SignupForm, LoginForm, StudentLoginForm } from "./Form.js";
import { StudentDashboard, StudentLogbook } from "./Student.js";
import { AdminDashboard, AdminStudentLogbook } from "./Admin.js";
import itf_logo from "./images/itf.jpeg";
import poly_logo from "./images/poly.jpeg";
import style from "./App.module.css";
const { Header, Footer, Sider, Content } = Layout;

export const HOST = "http://127.0.0.1:8000";

const mainMenu = (
  <Menu className={style.mainMenu} selectable>
    <Menu.ItemGroup title="User">
      <Menu.Item key="one" icon={<UserOutlined />}>
        <Link to="/login-student">
            Student Login
        </Link>
      </Menu.Item>
      <Menu.Item key="two" icon={<UserAddOutlined />}>
        <Link to="/signup-student">
        Student Signup
        </Link>
      </Menu.Item>
      <Menu.Item key="three" icon={<UserOutlined />}>
        <Link to="/login">
        Admin Login
        </Link>
      </Menu.Item>
    </Menu.ItemGroup>
    <Menu.ItemGroup title="Information">
      <Menu.Item key="four" icon={<LinkOutlined />}>
        About ITF
      </Menu.Item>
      <Menu.Item key="five" icon={<LinkOutlined />}>
        ITF official Website
      </Menu.Item>
      <Menu.Item key="six" icon={<ContactsOutlined />}>
        Contact Us
      </Menu.Item>
    </Menu.ItemGroup>
  </Menu>
);

const mainContent = (
  <Card className={style.card}>
    <div>
        <img src={itf_logo} alt="Industrial Training Fund Logo" />
    </div>
    <div>
      <hr />
      <h1>Industrial Training Fund</h1>
      <h2 className="mt-10">Student information and payment system</h2>
      <Button className={style.learnmoreBtn} type="primary">
        Learn More
      </Button>
      <hr />
    </div>
    <div className={style.mainSideMenu}>
      <ul>
        <li>
          <Link href="/login-student">
            <UserOutlined /> Login As Student
          </Link>
        </li>
        <li>
          <Link href="/signup-student">
            <UserAddOutlined /> Signup As Student
          </Link>
        </li>
        <li>
          <Link href="/login">
            <UserOutlined /> Login As Admin
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <ContactsOutlined /> Contact
          </Link>
        </li>
      </ul>
    </div>
  </Card>
);

const about = (
    <Card className={style.aboutContainer}>
        <Row gutter={50}>
            <Col md={12} sm={24}>
                    <Tag className={style.aboutTag} color={"#c51162"}>About ITF</Tag>
                    <p>Established in 1971, the Industrial Training Fund has operated consistently and painstakingly within the context of its enabling laws Decree 47 of 1971 as Amended in the 2011 ITF ACT. The objective for which the Fund was established has been pursued vigorously and efficaciously. In the four decades of its existence, the ITF has not only raised training consciousness in the economy, but has also helped in generating a corps of skilled indigenous manpower which has been manning and managing various sectors of the national economy.
Over the years, pursuant to its statutory responsibility, the ITF has expanded its structures, developed training programmes, reviewed its strategies, operations and services in order to meet the expanding, and changing demands for skilled manpower in the economy. Beginning as a Parastatal “B” in 1971, headed by a Director, the ITF became a Parastatal “A” in 1981, with a Director-General as the Chief Executive under the aegis of the Ministry of Industry. The Fund has a 13 member Governing Council and operates with 14 Departments and 2 Units at the Headquarters, 40 Area Offices, 4 Skills Training Centres, and a Centre for Industrial Training Excellence.</p>
            </Col>
            <Col md={12} sm={24}>
                <Tag className={style.aboutTag} color={"#880e4f"}> Vision Statement </Tag>
                <p>
To Be The Leading Skills Training Organisation In Nigeria And One Of The Best In The World.
                    </p>
                <Tag className={style.aboutTag} color={"#c2185b"}>
Mission Statement
                </Tag>
                <p>
To set, regulate Training Standards And Provide Need-based Human Capital Development Interventions Using Corps of Highly Competent Professionals In Line With Global Best Practices.
                </p>
                <Tag className={style.aboutTag} color={"#e91e63"}>
OBJECTIVES
                </Tag>
                <p>
The Objectives of establishing the School were as follows:- To support or Compliment the efforts of Federal Government of Nigeria, in providing qualitative and affordable education to Nigerian Citizens so as to develop a self reliant economy. It was established as a welfare package for Staff of Industrial Training Fund.
It was also established as a social Service to the immediate Community within which Industrial Training Fund operates.
                </p>
            </Col>
        </Row>
    </Card>
);

export const PrintContext = React.createContext();

//Main app component
function App() {
  
  const [printStudentData,setPrintStudentData] = React.useState({})

  return (
    <PrintContext.Provider value={setPrintStudentData}>
      <Layout id="mainLayout">
        <Header className="header">
          <h2><Link href="/">Industrial Training Fund</Link></h2>
          <Dropdown overlay={mainMenu}>
            <Button type="text" className={style.iconbutton}>
              <MenuOutlined />
            </Button>
          </Dropdown>
        </Header>
        <Content>
          <Route path="/">{mainContent}{about}</Route>
          <Route path="/signup-student">
            <SignupForm />
          </Route>
          <Route path="/login-student">
            <StudentLoginForm />
          </Route>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/student-dashboard">
            <StudentDashboard />
          </Route>
          <Route path="/admin-dashboard">
            <AdminDashboard />
          </Route>
          <Route path="/student-logbook" >
            <StudentLogbook />
          </Route>
            <Route path="/get-student-logbook/:matric_no" >
                {(params)=>{
                    return <AdminStudentLogbook matric_no={params.matric_no} />
                }}
          </Route>
          
        </Content>
        <Footer className={style.footer}>
            <h4 className="text-center">Designed by Tijani Oladimeji Afeez</h4>
            
        </Footer>
      </Layout>
        <StudentReceipt receiptdata={printStudentData}/>
    </PrintContext.Provider>
  ); 
}

const StudentReceipt = (props) => {
    let data = props.receiptdata;
    console.log(props)
    if(Object.keys(data).length===0){
        return (<div></div>)
    };
    console.log("Printed data available")
    console.log(data);
    return (
        <div id="receiptBody" style={{border: "10px groove black", width: "750px", height: "1000px", margin: "0 auto"}}>

            <h1 style={{textAlign: "center", marginTop: "50px"}}>
                <img src={itf_logo} style={{width: "75px", height: "75px", marginRight: "50px"}} />
                    INDUSTRIAL TRAINING FUND
                <img src={poly_logo }style={{width: "75px", height: "75px", marginLeft: "50px"}} />
            </h1>
            <p style={{maxWidth: "100%", overflow: "hidden"}}>***************************************************************************************************************************************************************************************</p>
            <h1 style={{textAlign: "center", marginTop: "150px", width: "350px", borderBottom: "5px solid black", marginLeft: "auto", marginRight: "auto"}} >{data.student.school}</h1>
            <h1 style={{textAlign: "center"}}>
                {data.payment_type}
            </h1>
            <h1 style={{textAlign: "center"}}>
                Payment for collection of Logbook
            </h1>
            <div style={{marginTop: "50px"}}>
                <h4 style={{textAlign: "center", width: "55%", display: "inline-block"}}>Name: {data.student.full_name}</h4> <h4 style={{textAlign: "center", width: "44%", display: "inline-block"}} >{data.student.matric_no}</h4>
            </div>
            <div style={{marginTop: "50px"}}>
                <h4 style={{textAlign: "center", width: "55%", display: "inline-block"}}>Date and Time: {data.created_at_format}</h4>
                <h4 style={{textAlign: "center", width: "45%", display: "inline-block"}}>Amount: {data.amount}</h4>
            </div>

            <p style={{marginTop: "220px", maxWidth: "100%", overflow: "hidden"}}>***************************************************************************************************************************************************************************************************</p>
            <p style={{textAlign: "center"}}>Designed by Tijani Oladimeji Afeez</p>
        </div>
    );
}

export default App;
