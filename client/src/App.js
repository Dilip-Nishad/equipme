import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';

import './App.css';
//---------------------Homepage / Navbar / Footer-------------
import HomePage from './HomePageComponents/HomePage';
import NavBar from './HeaderFooterComponents/NavBar';
import Footer from './HeaderFooterComponents/Footer'

// Import the new components
import ForgotPassword from './UserComponents/ForgotPassword';
import ResetPassword from './UserComponents/ResetPassword';

//---------------------Collections--------------------
import ProductCollection from './EquipmentComponents/ProductCollection';
import OwnerCollection from './OwnerComponents/OwnerCollection';
import RentalAgreementsCollection from './RentalComponents/RentalAgreementsCollection'
import UserCollection from './UserComponents/UserCollection';

//-------------------------Display Pages-----------------------------------
import ProductDisplay from './EquipmentComponents/ProductDisplay';
import OwnerDisplay from './OwnerComponents/OwnerDisplay';

//-------------------------UserForms----------------------------------------
import UserForm from './UserComponents/UserForm';

//-------------------------OwnerForms---------------------------------------
import OwnerForm from './OwnerComponents/OwnerForm';
import OwnerEditForm from './OwnerComponents/OwnerEditForm'

//------------------------ProductForm-------------------------------------
import ProductForm from './EquipmentComponents/ProductForm';
import ProductEditForm from './EquipmentComponents/ProductEditForm';
import RentalForm from './RentalComponents/RentalForm';
import OwnerEquipmentListing from './RentalComponents/OwnerEquipmentListing'

//----------------------User Login Functionality-----------------------------
import UserLogin from './UserComponents/UserLogin';
import { UserProvider } from './UserComponents/UserContext';

//----------------------Owner Login Functionality-----------------------------
import OwnerLogin from './OwnerComponents/OwnerLogin';
import { OwnerProvider } from './OwnerComponents/OwnerContext';

//----------------------API Functionality-----------------------------
import { ApiProvider } from './Api';

//----------------------Check Session Context -----------------------------
import { SessionProvider } from './UserComponents/SessionContext';

//---------------------- Calculate # of items ready for checkout Context -----------------------------
import { CartTotalNumbProvider } from './CheckoutComponents/AvailToCheckoutContext';

//----------------------Bar Chart Data Session Context -----------------------------
import {EquipmentDataProvider} from './ChartComponents/BarChartDataContext';

//----------------------User Functionality-----------------------------
import UserProfile from './UserComponents/UserProfile';
import UserCard from './UserComponents/UserCard';

//----------------------Owner Dashboard-----------------------------
import OwnerDashboard from './OwnerComponents/OwnerDashboardComponents/OwnerDashboard';


//----------------------Temporary Calendar-----------------------------
import Calendar from './CalendarComponents/Calendar';


//----------------------Temporary File Uploader for Equipment Images-----------------------------
import EquipmentImageFileUpload from './EquipmentComponents/EquipmentImageFileUpload' 
import ProductImageForm from './EquipmentComponents/ProductImageForm';
import BulkEquipmentUpload from './EquipmentComponents/BulkEquipmentUpload';

//---------------------- Messaging Component-----------------------------
import NewMessageThreads from './MessagingComponents/NewMessageThreads';

//---------------------- Checkout -----------------------------
// import Checkout from './CheckoutComponents/Checkout';
import StripeCheckout from './CheckoutComponents/StripeCheckout';
import AfterCheckout from './CheckoutComponents/AfterCheckout';
import Cart from './CheckoutComponents/Cart';
import OrderHistory from './CheckoutComponents/OrderHistory';

//---------------------- Rental Agreement Display -----------------------------
import RentalAgreementDisplay from './RentalComponents/RentalAgreementDisplay'

//---------------------- Extra Pages -----------------------------
import AboutUsPage from './ExtraPageComponents/AboutUs';
import CookiesPolicy from './ExtraPageComponents/Cookies';
import TermsAndConditionsPage from './ExtraPageComponents/TermsAndConditions';
import ContactUsPage from './ExtraPageComponents/ContactPage';

//---------------------- Toastify -----------------------------
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



function App() {

  //forgot to const navigate = useNavigate()
  const navigate = useNavigate()


  //Grab user and have it throughout the whole app
  const [currentUser, setCurrentUser] = useState([])
  const [role, setRole] = useState('')

  //These useStates will handle POST. Grabbing and ...spreading so it updates accordingly. Set Search Term & Grab Equipment Array
  const [equipmentArray, setEquipmentArray] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  //These useStates will handle POST. Grabbing and ...spreading so it updates accordingly.
  const [users, setUsers] = useState([])
  const [owners, setOwners] = useState([])
  const [rentalAgreement, setRentalAgreement] = useState([])

  //These useStates will handle PATCH.
  const [ownerToEdit, setOwnerToEdit] = useState([])
  const [equipmentToEdit, setEquipmentToEdit] = useState([])
  const [featuredRental, setFeaturedRental] = useState([])

  // State to determine if you came from ownerDash, below will be more state to control owner actions
  const [fromOwnerDash, setFromOwnerDash] = useState(false)

  // State to simply hold the amount of items ready to be checked out in a cart

  // context for APIUrl
  const apiUrl = process.env.REACT_APP_API_URL
  // console.log("this is the api url:", apiUrl)
  
  // After reading some React docs, I don't think I need all this state and effect!
  // https://react.dev/learn/you-might-not-need-an-effect


  //-------------------------------------------- FOR USER - CHECK SESSION TO STAY LOGGED IN ON REFRESH--------------------------
  useEffect(() => {
    fetch(`${apiUrl}check_session`, {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        console.log('User is not logged in.');
        setCurrentUser(null)
        setRole('')
      } else {
        // Handle other types of errors
        // console.log(`Session check failed`);
      }
    })
    .then(data => {
      if (data.role === 'user' || data.role === 'owner') {
        setCurrentUser(data.details)
        setRole(data.role)
      } else if (!data){
        // console.log("Error:", data)
      } else {
        console.log("No valid role found!")
      }
    })
    .catch(error => {
      // console.error('Error during session check:', error)
    })
  }, [apiUrl, setCurrentUser])
  
  //---------------------------------Fetches -----------------------
  //---------------------------------Posts and general Fetches -----------------------
  //Going to improvise this for the post also / maybe patch also?
  useEffect(() => {
    fetch(`${apiUrl}equipment`)
      .then((resp) => resp.json())
      .then((data) => {
        setEquipmentArray(data)
      })
  }, [])

  const addEquipment = (equipment) => {
    setEquipmentArray(equipmentArray => [...equipmentArray, equipment])
  }

  //------------------------------USERS----------------------------------------------

  //These will be the Post useEffects - USERS
  useEffect(() => {
    fetch(`${apiUrl}users`)
      .then((resp) => resp.json())
      .then((data) => {
        setUsers(data)
      })
  }, [])

  const addUser = (user) => {
    setUsers(users => [...users, user])
  }

  // const addCart = (newCart) =>{
  //   setNewUserCart(newUserCart => [...newUserCart, newCart])
  // }
  
  //------------------------------OWNERS----------------------------------------------

  //These will be the Post useEffects - OWNERS -- THIS HAD RENTERS
  useEffect(() => {
    fetch(`${apiUrl}equipment_owners`)
      .then((resp) => resp.json())
      .then((data) => {
        setOwners(data)
      })
  }, [])

  const addOwner = (owner) => {
    setOwners(owners => [...owners, owner])
  }
  // The above is also used for EDIT by that I mean the state variable setOwners

  // Delete here FOR OWNER--

    const deleteOwner = (ownerToDelete) => {
      setOwners(owners =>
        owners.filter(owner => owner.id !== ownerToDelete.id))
    }
  
  
    const handleOwnerDelete = (owner) => {
      fetch(`${apiUrl}equipment_owner/${owner.id}`, {
        method: "DELETE"
      })
        .then(() => {
          deleteOwner(owner)
          navigate('/equipment_owners')
        })
    }

  // EDIT/PATCH OWNERS-------------------------

  const updateOwner = (ownerToUpdate) => {
    setOwners(owners => owners.map(owner => {
      // && currentUser.id === ownerToUpdate.id
      if (owner.id === ownerToUpdate.id) {
        return ownerToUpdate
      } else {
        return owner
      }
    }))
  }

  const handleEditOwner = (owner) => {
    setOwnerToEdit(owner)
    navigate(`/owner/${owner.id}/edit`)
  }

  //------------------------------RENTAL AGREEMENTS----------------------------------------------
  //POST RENTAL AGREEMENTS

  // useEffect(() => {
  //   fetch(`${apiUrl}rental_agreements`)
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       setRentalAgreement(data)
  //     })
  // }, [])

  const addRentalAgreement = (rentalAgreement) => {
    setRentalAgreement(rentalAgreements => [...rentalAgreements, rentalAgreement])
  }

  //------------------------------Equipment----------------------------------------------
  //EDIT/PATCH Equipment

  const updateEquipment = (equipmentToUpdate) => {
    setEquipmentArray(equipments => equipments.map(equipment => {
      if (equipment.id === equipmentToUpdate.id) {
        return equipmentToUpdate
      } else {
        return equipment
      }
    }))

  }

  const handleEditEquipment = (equipment) => {
    setEquipmentToEdit(equipment)
    navigate(`/equipment/${equipment.id}/edit`)
  }


  //Delete for PRODUCTS/EQUIPMENT below

  const deleteEquipment = (equipmentToDelete) => {
    setEquipmentArray(equipments =>
      equipments.filter(equipment => equipment.id !== equipmentToDelete.id))
  }

  const handleEquipmentDelete = (equipment) => {
    fetch(`${apiUrl}equipment/${equipment.id}`, {
      method: "DELETE"
    })
      .then(() => {
        deleteEquipment(equipment)
        navigate('/equipment')
      })
  }
  //------------------------------------------------------------------------------------------------------


  // console.log("Equipment Array:", equipmentArray)
  // console.log("Type of equipment array:", Array.isArray(equipmentArray))
  // So I've tested this with array is array, it comes true, but when I do typeof it seems to think its an object
  //So I'm doing a work around
  let actualEquipmentArray = Array.isArray(equipmentArray) ? equipmentArray : Object.values(equipmentArray)
  const filteredEquipmentArray = actualEquipmentArray?.filter((item) => {
    return item.model?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.location?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.make?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  })
  //-----------------------------------------------------

  return (
    // UseContext gets called here, allowing the entirety of my app access to the USER and OWNER information!
    <SessionProvider>
      <CartTotalNumbProvider>
      <EquipmentDataProvider>
        <ApiProvider>
        <>
          <NavBar setSearchTerm={setSearchTerm} />

          <Routes>
            {/* Home Page */}
            <Route path='/' element={<HomePage equipmentArray={equipmentArray} setFeaturedRental={setFeaturedRental} />} />

            {/* COLLECTION ROUTES */}
            <Route path='/equipment' element={<ProductCollection equipmentArray={filteredEquipmentArray} handleEquipmentDelete={handleEquipmentDelete} handleEditEquipment={handleEditEquipment} />} />
            <Route path='/equipment_owners' element={<OwnerCollection searchTerm={searchTerm} handleEditOwner={handleEditOwner} handleOwnerDelete={handleOwnerDelete} equipmentOwnerArray={owners} />} />
            <Route path='/rental_agreements' element={<RentalAgreementsCollection />} />
            <Route path='/users' element={<UserCollection searchTerm={searchTerm} users={users}/>} />
    
            {/* ID / INDIVIDUAL / DISPLAY ROUTES */}
            <Route path='/equipment/:id' element={<ProductDisplay/>} />
            <Route path='/equipment_owner/:id' element={<OwnerDisplay setFromOwnerDash={setFromOwnerDash} fromOwnerDash={fromOwnerDash}/>} />

            {/* Respective Posts */}
            <Route path='/renter_signup' element={<UserForm addUser={addUser} />} />
            <Route path='/owner_signup' element={<OwnerForm addOwner={addOwner} />} />
            {/* need to rename the below to equipment_post */}
            <Route path='/list_equipment' element={<ProductForm addEquipment={addEquipment} />} />

            {/* Starting rentals, likely just going to use the prepop as it makes more sense than to do a "rental signup", in which a user sifts through all of the owners lol. This might not be the worst idea to incorporate into a search though. For example, filter by location, and then equipment type. The owner shouldn't really matter. But we can take into consideration the owners reviews / ratings and filter by lets say 3+ star renters. */}
            {/* I definitely don't need both of these. Likely going to remove OwnerEquipMentListing */}
            <Route path='/rental_signup' element={<RentalForm addRentalAgreement={addRentalAgreement} owners={owners} equipmentArray={equipmentArray} />} />
            {/* <Route path='/rental_signup_prepop' element={<OwnerEquipmentListing addRentalAgreement={addRentalAgreement} owners={owners} equipmentArray={equipmentArray} featuredRental={featuredRental} />} /> */}
            {/* Rename this too ^^^ */}

            {/* Respective Edit Routes */}
            <Route path='/owner/:id/edit' element={<OwnerEditForm ownerToEdit={ownerToEdit} updateOwner={updateOwner} />} />
            <Route path='/equipment/:id/edit' element={<ProductEditForm equipmentToEdit={equipmentToEdit} updateEquipment={updateEquipment} setEquipmentArray={setEquipmentArray} />} />

            {/* Login Page Route */}
            <Route path='/login' element={<UserLogin/>} />
            {/* <Route path='/owner/login' element={<OwnerLogin />} /> */}

            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />

            {/* User Profile Page*/}
            <Route path='/user/profile/:id' element={<UserProfile setFromOwnerDash={setFromOwnerDash} fromOwnerDash={fromOwnerDash}/>} />

            {/* Temp Route for CSV File Upload*/}
            <Route path='/temp/bulk_equipment_upload' element={<BulkEquipmentUpload setEquipmentArray={setEquipmentArray}/>} />

            {/* Owner Dashboard Page
            Likely converting this to just a general dashboard. Dashboards for everyone!
            */}
            <Route path='/dashboard' element={<OwnerDashboard updateOwner={updateOwner} ownerToEdit={ownerToEdit} fromOwnerDash={fromOwnerDash} setFromOwnerDash={setFromOwnerDash} searchTerm={searchTerm}/>} />

            {/* Temporary calendar routing */}
            <Route path='/calendar' element={<Calendar />} />

            {/* Temporary file upload routing */}
            <Route path='/temp/upload' element={<EquipmentImageFileUpload />} />
            <Route path='/temp/equipment/upload' element={<ProductImageForm />} />

            {/* Messaging routing  */}
            <Route path='/messaging' element={<NewMessageThreads fromOwnerDash={fromOwnerDash} setFromOwnerDash={setFromOwnerDash}/>} />
            <Route path='/user/card/:id' element={<UserCard/>} />

            {/* Temporary Checkout Routing */}
            <Route path='/checkout' element={<StripeCheckout/>} />
            <Route path='/checkout/successful/return' element={<AfterCheckout/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/order/history' element={<OrderHistory/>}/>

            {/* Rental Display */}
            <Route path='/handle/agreements/:rental_agreement_id' element={<RentalAgreementDisplay/>} />

            {/* Extra pages like contact us, cookies, about us, etc */}
            <Route path='/about/us' element={<AboutUsPage/>} />
            <Route path='/cookies' element={<CookiesPolicy/>} />
            <Route path='/terms/and/conditions' element={<TermsAndConditionsPage/>} />
            <Route path='/contact/us' element={<ContactUsPage/>} />
            

          </Routes>
          <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />

          <Footer />
        </>
        </ApiProvider>
      </EquipmentDataProvider>
      </CartTotalNumbProvider>
    </SessionProvider>
  );
}

export default App;
