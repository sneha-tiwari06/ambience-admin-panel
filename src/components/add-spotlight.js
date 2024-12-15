import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function AddSpotlight() {
    const [videoUpload, setVideoUpload] = useState(null);
    const [spotlightheading, setSpotlightheading] = useState("");
    const [spotlightcontent, setSpotlightcontent] = useState("");
    const [spotlightPointers, setSpotlightPointers] = useState({
        pointer1: "",
        pointer2: "",
        pointer3: "",
    });
    const [currentId, setCurrentId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({
        spotlightheading: "",
        spotlightcontent: "",
        pointer1: "",
        pointer2: "",
        pointer3: "",
        videoUpload: "",
    });

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchSpotlight = async () => {
        if (id) {
            try {
                const response = await axiosInstance.get(`/spotlights/${id}`);
                const spotlight = response.data;
                setSpotlightheading(spotlight.spotlightheading);
                setSpotlightcontent(spotlight.spotlightcontent);
                setSpotlightPointers({
                    pointer1: spotlight.spotlightPointer1,
                    pointer2: spotlight.spotlightPointer2,
                    pointer3: spotlight.spotlightPointer3,
                });
                setCurrentId(spotlight._id);
                setPreviewUrl(`${BASE_IMAGE_URL}${spotlight.videoUrl}`);
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (id) {
            fetchSpotlight();
        } else if (location.state?.videoUpload) {
            const { videoUpload: editVideo } = location.state;
            setSpotlightheading(editVideo.altText);
            setSpotlightcontent(editVideo.bannerText);
            setSpotlightPointers({
                pointer1: editVideo.spotlightPointer1,
                pointer2: editVideo.spotlightPointer2,
                pointer3: editVideo.spotlightPointer3,
            });
            setCurrentId(editVideo._id);
            setPreviewUrl(`${BASE_IMAGE_URL}${editVideo.imageUrl}`);
        }
    }, [id, location.state]);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setVideoUpload(file);
        setPreviewUrl(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, videoUpload: "" })); // clear video error
    };

    const handleTextChange = (e) => {
        const { id, value } = e.target;
        if (id === "spotlightheading") setSpotlightheading(value);
        else if (id === "spotlightcontent") setSpotlightcontent(value);
        else if (id.includes("pointer")) {
            const pointerKey = `pointer${id.charAt(id.length - 1)}`;
            setSpotlightPointers((prev) => ({ ...prev, [pointerKey]: value }));
        }

        setErrors((prev) => ({ ...prev, [id]: "" })); // clear field-specific error
    };

    const validateForm = () => {
        const newErrors = {};

        if (!spotlightheading) newErrors.spotlightheading = "Spotlight heading is required.";
        if (!spotlightcontent) newErrors.spotlightcontent = "Spotlight content is required.";
        if (!spotlightPointers.pointer1) newErrors.pointer1 = "Pointer 1 is required.";
        if (!spotlightPointers.pointer2) newErrors.pointer2 = "Pointer 2 is required.";
        if (!spotlightPointers.pointer3) newErrors.pointer3 = "Pointer 3 is required.";
        if (!videoUpload) newErrors.videoUpload = "Please upload a video.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; 

        const formData = new FormData();
        formData.append("videoUpload", videoUpload);
        formData.append("spotlightheading", spotlightheading);
        formData.append("spotlightcontent", spotlightcontent);
        formData.append("spotlightPointer1", spotlightPointers.pointer1);
        formData.append("spotlightPointer2", spotlightPointers.pointer2);
        formData.append("spotlightPointer3", spotlightPointers.pointer3);

        try {
            if (currentId) {
                await axiosInstance.put(`/spotlights/${currentId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Spotlight updated successfully.");
            } else {
                await axiosInstance.post("/spotlights/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Spotlight created successfully.");
            }
            navigate('/spotlights');
            resetForm();
        } catch (error) {
            console.error(error);
            alert("Error uploading Spotlight.");
        }
    };

    const resetForm = () => {
        setVideoUpload(null);
        setSpotlightheading("");
        setSpotlightcontent("");
        setSpotlightPointers({ pointer1: "", pointer2: "", pointer3: "" });
        setCurrentId(null);
        setPreviewUrl(null);
        setErrors({
            spotlightheading: "",
            spotlightcontent: "",
            pointer1: "",
            pointer2: "",
            pointer3: "",
            videoUpload: "",
        }); // Reset errors
    };

    return (
        <div className='w-100 add-spotlight'>
            <div className='section-heading'>
                <h2>{currentId ? "Edit" : "Add"} Spotlight</h2>
            </div>
            <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
                <div className="back-btn">
                    <Link to="/spotlights">
                        <button type="button" className="w-auto btn btn-primary">
                            Back
                        </button>
                    </Link>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="spotlightheading" className="form-label">Add Spotlight Heading</label>
                    <input
                        type="text"
                        className="form-control"
                        id="spotlightheading"
                        value={spotlightheading}
                        onChange={handleTextChange}
                    />
                    {errors.spotlightheading && <small className="text-danger">{errors.spotlightheading}</small>}
                </div>
                <div className="mb-3">
                    <label htmlFor="spotlightcontent" className="form-label">Add Spotlight Content</label>
                    <input
                        type="text"
                        className="form-control"
                        id="spotlightcontent"
                        value={spotlightcontent}
                        onChange={handleTextChange}
                    />
                    {errors.spotlightcontent && <small className="text-danger">{errors.spotlightcontent}</small>}
                </div>
                <div className="banner-pointers">
                    <div className="row">
                        {[1, 2, 3].map((i) => (
                            <div className="col-md-4" key={i}>
                                <div className="mb-3">
                                    <label htmlFor={`banner-pointer${i}`} className="form-label">
                                        Add Banner Pointer {i}
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id={`banner-pointer${i}`}
                                        value={spotlightPointers[`pointer${i}`]}
                                        onChange={handleTextChange}
                                    />
                                    {errors[`pointer${i}`] && <small className="text-danger">{errors[`pointer${i}`]}</small>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="videoUpload" className="form-label">Upload Video</label>
                    <input
                        className="form-control"
                        type="file"
                        id="videoUpload"
                        name="video"
                        accept="video/*"
                        onChange={handleVideoChange}
                    />
                    {errors.videoUpload && <small className="text-danger">{errors.videoUpload}</small>}
                    {previewUrl && <video src={previewUrl} controls className="mt-2" style={{height: "200px"}}/>}
                    {/* <div className="form-text">Please upload a video file.</div> */}
                </div>
                <button type="submit" className="w-auto btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddSpotlight;