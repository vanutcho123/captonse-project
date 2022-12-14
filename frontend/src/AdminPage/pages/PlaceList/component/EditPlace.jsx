import React, { useEffect, useReducer } from "react";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import "./CreateEdit.scss";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import { convertToSlug } from "../../../components/convertToSlug";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const EditPlace = () => {
  const params = useParams(); // /product/:id
  const { id: productId } = params;
  const token = useSelector((state) => state.token);

  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTile] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [district, setDistrict] = useState("");
  const [rating, setRating] = useState(5);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/places/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setTile(data.title);
        setCategory(data.category);
        setImage(data.image);
        setDistrict(data.district);
        setRating(data.rating);
        setAddress(data.address);
        setDescription(data.description);
        setMapUrl(data.mapUrl);

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err,
        });
      }
    };
    fetchData();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/places/${productId}`,
        {
          _id: productId,
          name,
          slug,
          title,
          category,
          image,
          district,
          rating,
          address,
          description,
          mapUrl,
        },
        {
          headers: { Authorization: token },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("C???p nh???t th??nh c??ng");
      navigate("/admin/places");
    } catch (err) {
      toast.error("C???p nh???t kh??ng th??nh c??ng");
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const handleChange = (e) => {
    setName(e.target.value);
    setSlug(convertToSlug(e.target.value));
  };

  return (
    <div className="new">
      {loading ? (
        <Loading />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="newContainers">
          <div className="toph">
            <h1>Th??m ?????a ??i???m</h1>
          </div>
          <div className="bottom">
            <form onSubmit={handleSubmit} className="form">
              <div className="form__container">
                <div className="formInput">
                  <label>T??n ?????a ??i???m</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p ?????a ??i???m v??o ????y..."
                    value={name}
                    onChange={handleChange}
                  />
                </div>
                <div className="formInput">
                  <label>Slug</label>
                  <input
                    required
                    type="text"
                    placeholder="V?? d???: cau-song-han"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
                <div className="formInput">
                  <label>Ti??u ?????</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p ti??u ????? v??o ????y..."
                    value={title}
                    onChange={(e) => setTile(e.target.value)}
                  />
                </div>

                <div className="formInput">
                  <label>Th??? lo???i</label>
                  <select
                    required
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">L???a ch???n...</option>
                    <option value="?????a ??i???m tham quan">
                      ?????a ??i???m tham quan
                    </option>
                    <option value="B??i bi???n ?????p">B??i bi???n ?????p</option>
                    <option value="V??n ho?? t??n ng?????ng">
                      V??n ho?? t??n ng?????ng
                    </option>
                    <option value="?????a ??i???m vui ch??i h???p d???n">
                      ?????a ??i???m vui ch??i h???p d???n
                    </option>
                    <option value=" Check-in ???? N???ng">Check-in ???? N???ng</option>
                    <option value="Qu??n ??n Chay">Qu??n ??n</option>
                  </select>
                </div>
                {/* <div className="formInput">
                <>
                  <label htmlFor="file">
                    H??nh ???nh: <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </>
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                />
              </div> */}
                <div className="formInput">
                  <label>H??nh ???nh</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p link h??nh ???nh v??o ????y..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="formInput">
                  <label>Thu???c Qu???n</label>
                  <select
                    required
                    onChange={(e) => setDistrict(e.target.value)}
                    value={district}
                  >
                    <option value="">L???a ch???n...</option>
                    <option value="H???i Ch??u">H???i Ch??u</option>
                    <option value="Thanh Kh??">Thanh Kh??</option>
                    <option value="Li??n Chi???u">Li??n Chi???u</option>
                    <option value="S??n Tr??">S??n Tr??</option>
                    <option value="C???m L???">C???m L???</option>
                    <option value="Ng?? h??nh S??n">Ng?? H??nh S??n</option>
                    <option value="Kh??c">Kh??c</option>
                  </select>
                </div>
                <div className="formInput">
                  <label>????nh gi??</label>
                  <select
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                  >
                    <option value="">L???a ch???n...</option>
                    <option value="1">1- Kh??ng ?????p</option>
                    <option value="2">2- B??nh th?????ng</option>
                    <option value="3">3- ?????p</option>
                    <option value="4">4- R???t ?????p</option>
                    <option value="5">5- R???t r???t ?????p</option>
                  </select>
                </div>
                <div className="formInput">
                  <label required>?????a ch???</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p ?????a ch??? v??o ????y..."
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                  />
                </div>

                <div className="formInput">
                  <label>M?? t???</label>
                  <textarea
                    type="text"
                    placeholder="Nh???p th??ng tin ?????a ??i???m..."
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  ></textarea>
                </div>

                <div className="formInput">
                  <label>Link b???n ?????</label>
                  <input
                    type="text"
                    placeholder="Nh???p link b???n ????? v??o ????y"
                    onChange={(e) => setMapUrl(e.target.value)}
                    value={mapUrl}
                  />
                </div>
                <button type="submit">S???a ?????a ??i???m </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlace;
