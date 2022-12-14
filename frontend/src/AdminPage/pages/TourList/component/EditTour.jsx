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

const EditTour = () => {
  const params = useParams(); // /product/:id
  const { id: tourId } = params;
  const token = useSelector((state) => state.token);

  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [route, setRoute] = useState("");
  const [description, setDescription] = useState("");
  const [hotline, setHotline] = useState("");
  const [serviceIncludes, setServiceIncludes] = useState("");
  const [serviceNotIncludes, setServiceNotIncludes] = useState("");
  const [childrenPolicy, setChildrenPolicy] = useState("");
  const [images, setImages] = useState([]);
  // const [tourSchedule, setTourSchedule] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/tours/${tourId}`);
        setName(data.name);
        setSlug(data.slug);
        setTitle(data.title);
        setTime(data.time);
        setPrice(data.price);
        setAddress(data.address);
        setRoute(data.route);
        setDescription(data.description);
        setHotline(data.hotline);
        setServiceIncludes(data.serviceIncludes);
        setServiceNotIncludes(data.serviceNotIncludes);
        setChildrenPolicy(data.childrenPolicy);
        setImages(data.images);
        setNote(data.note);

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err,
        });
      }
    };
    fetchData();
  }, [tourId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/tours/${tourId}`,
        {
          _id: tourId,
          name,
          slug,
          title,
          time,
          price,
          address,
          route,
          description,
          hotline,
          serviceIncludes,
          serviceNotIncludes,
          childrenPolicy,
          images,
          note,
        },
        {
          headers: { Authorization: token },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("C???p nh???t th??nh c??ng");
      navigate("/admin/tours");
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
            <h1>S???a h??nh tr??nh</h1>
          </div>
          <div className="bottom">
            <form onSubmit={handleSubmit} className="form">
              <div className="form__container">
                <div className="formInput">
                  <label>T??n h??nh tr??nh</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p t??n h??nh tr??nh..."
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
                  <label>Ti??u ????? h??nh tr??nh</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p ti??u ????? h??nh tr??nh"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="formInput">
                  <label>Th???i gian chuy???n ??i</label>
                  <select
                    required
                    onChange={(e) => setTime(e.target.value)}
                    value={time}
                  >
                    <option value="">L???a ch???n...</option>
                    <option value="1 ng??y">1 ng??y</option>
                    <option value="2 ng??y 1 ????m">2 ng??y 1 ????m</option>
                    <option value="3 ng??y2 ????m">3 ng??y 2 ????m</option>
                    <option value="4 ng??y 3 ????m">4 ng??y 3 ????m</option>
                    <option value="5 ng??y 4 ????m">5 ng??y 4 ????m</option>
                  </select>
                </div>
                <div className="formInput">
                  <label>Gi?? h??nh tr??nh</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p gi?? h??nh tr??nh"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="formInput">
                  <label>?????a ch??? h??nh tr??nh</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p ?????a ch??? h??nh tr??nh"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="formInput">
                  <label>Tuy???n ???????ng</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p tuy???n h??nh tr??nh"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                  />
                </div>
                <div className="formInput">
                  <label>M?? t??? h??nh tr??nh</label>
                  <textarea
                    type="text"
                    placeholder="Nh???p th??ng tin h??nh tr??nh..."
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  ></textarea>
                </div>

                <div className="formInput">
                  <label>Hotline</label>
                  <input
                    required
                    type="text"
                    placeholder="Hotline li??n h???..."
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                  />
                </div>

                <div className="formInput">
                  <label>D???ch v??? bao g???m</label>
                  <textarea
                    type="text"
                    placeholder="D???ch v??? bao g???m"
                    required
                    onChange={(e) => setServiceIncludes(e.target.value)}
                    value={serviceIncludes}
                  ></textarea>
                </div>

                <div className="formInput">
                  <label>D???ch v??? kh??ng bao g???m</label>
                  <textarea
                    type="text"
                    placeholder="D???ch v??? kh??ng bao g???m..."
                    required
                    onChange={(e) => setServiceNotIncludes(e.target.value)}
                    value={serviceNotIncludes}
                  ></textarea>
                </div>

                <div className="formInput">
                  <label>Ch??nh s??ch tr??? em</label>
                  <textarea
                    type="text"
                    placeholder="Ch??nh s??ch tr??? em..."
                    required
                    onChange={(e) => setChildrenPolicy(e.target.value)}
                    value={childrenPolicy}
                  ></textarea>
                </div>

                <div className="formInput">
                  <label>H??nh ???nh</label>
                  <input
                    required
                    type="text"
                    placeholder="Nh???p h??nh ???nh"
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                  />
                </div>

                {/* <div className="formInput">
                <label>K??? ho???ch tour</label>
                <input
                  required
                  type="text"
                  placeholder="Nh???p k??? ho???ch tour"
                  value={tourSchedule}
                  onChange={(e) => setTourSchedule(e.target.value)}
                />
              </div> */}
                <div className="formInput">
                  <label>M???t s??? l??u ??</label>
                  <textarea
                    type="text"
                    placeholder="M???t s??? l??u ?? cho h??nh tr??nh..."
                    required
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                  ></textarea>
                </div>

                <button type="submit">C???p nh???t h??nh tr??nh </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTour;
