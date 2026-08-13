import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../state/auth.slice';
import '../style/address.scss';
import { useAuth } from '../hook/useAuth';
import { useCart } from '../../cart/hook/useCart';
import { useRazorpay } from "react-razorpay";

const Address = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const addresses = user?.address || [];
  const {handleUpdateAddress} = useAuth()
  const {handleCreateOrder,handleVerifyPayment} = useCart()
  const { error, isLoading, Razorpay } = useRazorpay();

  const [updatingId, setUpdatingId] = useState(null);
  const [selectedId, setSelectedId] = useState(
    addresses.find((a) => a.isDefault)?._id || addresses[0]?._id || null
  );

  const defaultAddress = addresses.find((a) => a.isDefault);
  const otherAddresses = addresses.filter((a) => !a.isDefault);

  const handleMarkDefault = async (addressId) => {
    setUpdatingId(addressId);
    console.log("clicked", addressId);
    const updatedUser = await handleUpdateAddress({
      form: { isDefault: true },
      addressId,
    });
    if (updatedUser) {
      dispatch(setUser(updatedUser));
      setSelectedId(addressId);
    }
    setUpdatingId(null);
  };

  // const handleProceed = () => {
  //   if (!selectedId) return;
  //   navigate('/checkout/payment', { state: { addressId: selectedId } });
  // };

 const renderCard = (addr) => (
  <div
    key={addr._id}
    className={`address-card ${
      selectedId === addr._id ? 'address-card--active' : ''
    }`}
    onClick={() => setSelectedId(addr._id)}
  >
    <div className="address-card__radio">
      <span className="address-card__dot" />
    </div>

    <div className="address-card__body">
      <div className="address-card__top">
        <span className="address-card__name">{addr.name}</span>
        {addr.isDefault && (
          <span className="address-card__badge">Default</span>
        )}
      </div>

      <p className="address-card__line">
        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
      </p>
      <p className="address-card__line">{addr.country}</p>
      <p className="address-card__phone">Phone Number - {addr.mobileNumber}</p>

      {!addr.isDefault && (
        <button
          className="link-btn"
          disabled={updatingId === addr._id}
          onClick={(e) => {
            e.stopPropagation();
            handleMarkDefault(addr._id);
          }}
        >
          {updatingId === addr._id ? 'Setting...' : 'Set as Default'}
        </button>
      )}
    </div>

    <button
      className="edit-btn"
      onClick={(e) => e.stopPropagation()}
    >
      EDIT
    </button>
  </div>
);

async function handleCheckout(){
  const order = await handleCreateOrder()
  console.log('order ',order);
  const options= {
      key: "rzp_test_TOntJ7wd0Ghs5z",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: user.fullName,
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async (response) => {
        console.log(response);
        const isValid = await handleVerifyPayment(response)
        if(isValid){
          navigate('/payment/success')
        }
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.mobileNumber,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  
}

  return (
  <div className="checkout-address">
    <div className="checkout-address__header">
      <h1>Select Delivery Address</h1>
      <button className="add-new-link" onClick={() => navigate('/address/add')}>
        + ADD NEW
      </button>
    </div>

    <p className="checkout-address__subheading">Saved Addresses</p>

    {addresses.length === 0 ? (
      <div className="address-empty">
        <p>No saved addresses yet</p>
        <span>Add one to continue with checkout</span>
      </div>
    ) : (
      <div className="address-list">
        {defaultAddress && renderCard(defaultAddress)}
        {otherAddresses.map((addr) => renderCard(addr))}
      </div>
    )}

    <button
      className="btn-solid"
      disabled={!selectedId}
      onClick={handleCheckout}
    >
      Deliver Here
    </button>
  </div>
);
};

export default Address;