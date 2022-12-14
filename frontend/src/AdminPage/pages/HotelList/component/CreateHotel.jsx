import React, { useReducer } from "react";
import { useState } from "react";
import "./CreateEdit.scss";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { convertToSlug } from "../../../components/convertToSlug";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    // case "UPLOAD_REQUEST":
    //   return { ...state, loadingUpload: true, errorUpload: "" };
    // case "UPLOAD_SUCCESS":
    //   return {
    //     ...state,
    //     loadingUpload: false,
    //     errorUpload: "",
    //   };
    // case "UPLOAD_FAIL":
    //   return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const valueTags = [
  "Có phòng hội nghị",
  "Dành cho cặp đôi",
  "Gần biển",
  "Ăn sáng ngon",
  "Gần chợ",
  "Gần chợ đêm",
  "Gần phố đi bộ",
  "Gần sân bay",
  "Giá rẻ",
  "Hồ bơi ngoài trời",
  "Phù hợp gia đình",
  "View sông Hàn",
  "Có spa message",
  "Có bar pub",
  "Có hồ bơi",
  "Gần cầu sông hàn",
];

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 500,
    },
  },
};

const CreateHotel = () => {
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [hotline, setHotline] = useState("");
  const [images, setImages] = useState([]);
  const [type, setType] = useState(5);
  const [price, setPrice] = useState(0);
  const [tags, setTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axios.post(
        "/api/hotels",
        {
          name,
          slug,
          address,
          district,
          description,
          mapUrl,
          hotline,
          images,
          type,
          price,
          tags,
        },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Thêm khách sạn thành công!");
      dispatch({ type: "FETCH_SUCCESS" });
      navigate("/admin/hotels");
    } catch (err) {
      toast.error(error);
      dispatch({
        type: "FETCH_FAIL",
      });
    }
  };

  const handleChange = (e) => {
    setName(e.target.value);
    setSlug(convertToSlug(e.target.value));
  };

  const handleChangeTags = (e) => {
    const {
      target: { value },
    } = e;
    setTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div className="new">
      <div className="newContainers">
        <div className="toph">
          <h1>Thêm Khách sạn</h1>
        </div>
        <div className="bottom">
          <form onSubmit={handleSubmit} className="form">
            <div className="form__container">
              <div className="formInput">
                <label>Tên khách sạn</label>
                <input
                  required
                  type="text"
                  placeholder="Nhập tên khách sạn..."
                  value={name}
                  onChange={handleChange}
                />
              </div>
              <div className="formInput">
                <label>Slug</label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: cau-song-han"
                  value={slug}
                />
              </div>
              <div className="formInput">
                <label>Địa chỉ</label>
                <input
                  required
                  type="text"
                  placeholder="Nhập địa chỉ khách sạn..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="formInput">
                <label>Thể loại</label>
                <select
                  required
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                >
                  <option value="">Lựa chọn...</option>
                  <option value="2">Khách sạn 2 sao</option>
                  <option value="3">Khách sạn 3 sao</option>
                  <option value="4">Khách sạn 4 sao</option>
                  <option value="5">Khách sạn 5 sao</option>
                </select>
              </div>
              <div className="formInput">
                <label>Tải Hình ảnh</label>
                <input
                  required
                  type="text"
                  placeholder="Nhập link hình ảnh vào đây..."
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                />
              </div>

              <div className="formInput">
                <label>Thuộc Quận</label>
                <select
                  required
                  onChange={(e) => setDistrict(e.target.value)}
                  value={district}
                >
                  <option value="">Lựa chọn...</option>
                  <option value="Hải Châu">Hải Châu</option>
                  <option value="Thanh Khê">Thanh Khê</option>
                  <option value="Liên Chiểu">Liên Chiểu</option>
                  <option value="Sơn Trà">Sơn Trà</option>
                  <option value="Cẩm Lệ">Cẩm Lệ</option>
                  <option value="Ngũ hành Sơn">Ngũ Hành Sơn</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="formInput">
                <label>Mô tả</label>
                <textarea
                  type="text"
                  placeholder="Nhập thông khách sạn..."
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>

              <div className="formInput">
                <label>Link bản đồ</label>
                <input
                  type="text"
                  placeholder="Nhập link bản đồ vào đây"
                  onChange={(e) => setMapUrl(e.target.value)}
                  value={mapUrl}
                />
              </div>
              <div className="formInput">
                <label>Hotline</label>
                <input
                  type="text"
                  placeholder="Nhập hotline..."
                  onChange={(e) => setHotline(e.target.value)}
                  value={hotline}
                />
              </div>

              <div className="formInput">
                <label>Giá phòng trung bình</label>
                <input
                  type="number"
                  placeholder="Nhập giá phòng trung bình..."
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </div>

              <div className="formInput">
                <label>View - Dịch vụ khách sạn</label>

                <FormControl sx={{ width: "100%", mt: 2 }}>
                  <InputLabel
                    id="demo-multiple-checkbox-label"
                    sx={{ fontSize: "12px" }}
                  >
                    Tags
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={tags}
                    onChange={handleChangeTags}
                    input={<OutlinedInput label="Tags" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    fullWidth
                  >
                    {valueTags.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={tags.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <button type="submit">Thêm khách sạn </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHotel;
