import React, { useState } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import NavMenu from './components/NavMenu/NavMenu'
import NavMenu2 from './components/NavMenu/NavMenu2'
import axios from 'axios'
import Cookies from 'universal-cookie'

const SupplierPage = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
`

const Title = styled.h1`
  color: #333333;
  text-align: center;
`

const SupplierList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const SupplierItem = styled.li`
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 15px;
`

const Header = styled.header`
  background-image: linear-gradient(0deg, #afd3d1, #4293f0);
  color: white;
  padding: 10px 0;
`

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 90%;
  margin: 0 auto;
  padding: 0 20px;
`

const Logo = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 24px;
  color: #2e88e2;
`

const Menu = styled.ul`
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
`

const MenuItem = styled.li`
  margin-left: 20px;
`

const MenuLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const Home = () => {
return (
  <div>
    <h2>Suppplier Portal</h2>
    <button onClick={() => generalQueryGoLang('get_supplier_list', {
      command1: 1,
      command2: 'get_supplier_list',
      command3: 'get_supplier_list',
      command4: 'get_supplier_list',
      command5: 'get_supplier_list',
      command6: 'get_supplier_list',
      command7: 'get_supplier_list',
      command8: 'get_supplier_list',
      command9: 'get_supplier_list',
      command10: 'get_supplier_list', 
    }).then((res) => {
      console.log(res.data.data);
    })}>Get Supplier List</button>
  </div>
)}
const About = () => <h2>About Page</h2>
const Contact = () => <h2>Contact Page</h2>
const Orders = () => <h2>Orders Page</h2>
const Delivery = () => <h2>Delivery Page</h2>
const Forecast = () => <h2>Forecast Page</h2>
const VendorQuality = () => <h2>Vendor Quality Page</h2>
const IncomingInspection = () => <h2>Incoming Inspection Page</h2>
const QualityIssue = () => <h2>Quality Issue Page</h2>
const Audit = () => <h2>Audit Page</h2>
const CMSRequest = () => <h2>CMS Request Page</h2>

const Footer = styled.footer`
  background-color: #333;
  color: white;
  padding: 5px 0;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
`

const FooterContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const FooterText = styled.p`
  margin: 0;
`
axios.defaults.withCredentials = true;
const cookies = new Cookies();
export async function generalQueryGoLang(command: string, queryData: any) {
  console.log(queryData);
  const CURRENT_API_URL = 'http://localhost:3002/api';
  // console.log('API URL', CURRENT_API_URL);
  let data = await axios.post(CURRENT_API_URL, {
    command: command,
    DATA: { ...queryData, token_string: cookies.get("token") },
  });
  console.log(data);
  return data;
}

const Suppliers = () => {
  const supplierData = [
    { id: 1, name: 'Acme Supply Co.', category: 'Electronics' },
    { id: 2, name: 'Green Fields Produce', category: 'Fresh Produce' },
    { id: 3, name: 'Tech Innovations Inc.', category: 'Software' },
  ]

  const [isVendorQualityOpen, setIsVendorQualityOpen] = useState(false);

  
  return (
    <Router>
      <Header>
        <Navbar>
          <Logo><img src={'./companylogo.png'} alt="CMS VINA" width={100} height={25}/>Supplier Hub</Logo>                   
          <Menu>
            <NavMenu2 />
          </Menu>
        </Navbar>
      </Header>
      <Routes>        
        <Route path="/" element={<Home />} />
        <Route path="/suppliers" element={
          <SupplierPage>
            <Title>Our Suppliers</Title>
            <SupplierList>
              {supplierData.map((supplier) => (
                <SupplierItem key={supplier.id}>
                  <h3>{supplier.name}</h3>
                  <p>Category: {supplier.category}</p>
                </SupplierItem>
              ))}
            </SupplierList>
          </SupplierPage>
        } />
        <Route path="/incoming-inspection" element={<IncomingInspection />} />
        <Route path="/quality-issue" element={<QualityIssue />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/cms-request" element={<CMSRequest />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/vendorquality" element={<VendorQuality />} />
      </Routes>
      <Home />
      <Footer>
        <FooterContent>
          <FooterText>&copy; 2024 CMS VINA. All rights reserved.</FooterText>
        </FooterContent>
      </Footer>
    </Router>
  )
}

export default Suppliers