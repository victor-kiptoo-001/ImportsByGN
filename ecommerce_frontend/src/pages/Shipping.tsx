import axios from "axios";
import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart, saveShippingInfo } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { newOrderRequest } from "../types/api-types";
import { CartItem } from "../types/types";
import { responseToast } from "../utils/features";

interface DataType {
  photo: ReactElement;
  name: string;
  price: string;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
];

const Shipping = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [newOrder] = useNewOrderMutation();
  const { shippingCharge, cartItems, subtotal, tax, discount, total } =
    useSelector((state: RootState) => state.cartReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (paymentMethod == "") {
        return toast.error("Please select a payment method");
      }
      setIsProcessing(true);
      dispatch(saveShippingInfo(shippingInfo));
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
     

      if (paymentMethod === "Bank") {
        navigate("/pay", {
          state: data.clientSecret,
        });
      } else {
        const orderData: newOrderRequest = {
          shippingInfo,
          shippingCharge,
          orderItems: cartItems,
          subtotal,
          tax,
          discount,
          total,
          user: user?._id!,
        };

        const res = await newOrder(orderData);
        dispatch(resetCart());
        responseToast(res, navigate, "/orders");
        setIsProcessing(false);
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error((error as Error).message || "Something went wrong");
    }
  };


  const [rows, setRows] = useState<DataType[]>([]);
  useEffect(() => {
    if (cartItems)
      setRows(
        cartItems.map((i: CartItem) => ({
          photo: <img src={i.photo} />,
          name: i.name,
          price: `₹${i.price}`,
        }))
      );
  }, [cartItems]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "order-item-heading",
    "Order Details",
    rows.length > 6
  )();

  return (
    <div className="shipping">
      <form id="myForm" onSubmit={submitHandler}>
        <h1>Billing Details</h1>
        <input
          required
          type="text "
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          type="text "
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          required
          type="text "
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Select Country</option>
          <option value="kenya">Kenya</option>
          <option value="other">Other</option>
        </select>
        <input
          required
          type="number "
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
      </form>
      <div className="order-items">
        <main>{cartItems.length > 0 ? Table : <h1>No Items Added</h1>}</main>

        <h3>
          Total: <span>₹{total}</span>
        </h3>

        <div id="payment">
          <label className="custom-radio">
            <input
              form="myform"
              required
              type="radio"
              name="option"
              value="Bank"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Bank Transfer
          </label>
          <label className="custom-radio">
            <input
              form="myform"
              required
              type="radio"
              name="option"
              value="Cash"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>

        <button type="submit" disabled={isProcessing} form="myForm">
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default Shipping;
