import React, { useEffect, useState } from "react";
import "../../styles/dashboard/Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function CustomerProfile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/customer/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({ ...data });
      })
      .catch(() => toast.error("Failed to fetch profile data."));
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "city" && value.length > 30) ||
      (name === "state" && value.length > 30) ||
      (name === "address" && value.length > 250)
    )
      return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
    const err = {};

    if (!form.name?.trim()) err.name = "Name is required";

    if (form.contactNumber && !/^\d{10}$/.test(form.contactNumber))
      err.contactNumber = "Phone number must be exactly 10 digits";

    if (form.alternatePhoneNumber && !/^\d{10}$/.test(form.alternatePhoneNumber))
      err.alternatePhoneNumber = "Alternate number must be exactly 10 digits";

    if (form.city && form.city.length > 30)
      err.city = "City too long (max 30 characters)";

    if (form.state && form.state.length > 30)
      err.state = "State too long (max 30 characters)";

    if (form.street && form.street.length > 30)
      err.street = "Street too long (max 30 characters)";

    if (form.country && form.country.length > 30)
      err.country = "Country too long (max 30 characters)";

    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      err.pincode = "Pincode must be exactly 6 digits";

    if (form.gender && !["Male", "Female", "Prefer not to say"].includes(form.gender))
      err.gender = "Invalid gender selected";

    if (form.dateOfBirth && form.dateOfBirth.length > 12)
      err.dateOfBirth = "Invalid date format";

    return err;
  };


  const validatePassword = () => {
    const { password, confirmPassword } = passwordForm;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!password) {
      toast.error("Password is required", { autoClose: 3000 });
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Must be 8+ chars with uppercase, lowercase, number, special char", {
        autoClose: 3000,
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 3000 });
      return false;
    }

    return true;
  };



  const saveProfile = () => {
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Exclude username/email/role from update
    const updatedForm = { ...form };
    delete updatedForm.username;
    delete updatedForm.email;
    delete updatedForm.role;

    fetch("http://localhost:8081/api/customer/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedForm),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Profile updated successfully!", {
          autoClose: 1000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
        setTimeout(() => {
          setUser(data);
          setEditMode(false);
        }, 1000);
      })
      .catch(() => toast.error("Failed to update profile."));
  };

  const savePassword = () => {
    if (!validatePassword()) return;

    fetch("http://localhost:8081/api/customer/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...user, password: passwordForm.password }),
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Password updated successfully", { autoClose: 2000 });
        setPasswordEditMode(false);
        setPasswordForm({ password: "", confirmPassword: "" });
      })
      .catch(() => toast.error("Failed to update password", { autoClose: 2000 }));
  };




  return (
    <div className="profile-board">
      <ToastContainer position="top-center" autoClose={1500} pauseOnHover={false} pauseOnFocusLoss={false} />

      {/* PROFILE SECTION */}
      <div className="profile-card">
        <h2>👤 Customer Profile</h2>
        <form className="profile-form three-column-grid">
          {/* Column 1 */}
          <div className="form-group">
            <label>Name:</label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input name="username" value={form.username || ""} readOnly style={{ backgroundColor: "#eee" }} />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input name="email" value={form.email || ""} readOnly style={{ backgroundColor: "#eee" }} />
          </div>

          {/* Column 2 */}
          <div className="form-group">
            <label>Contact Number:</label>
            <input
              name="contactNumber"
              value={form.contactNumber || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
          </div>

          <div className="form-group">
            <label>Alternate Phone:</label>
            <input
              name="alternatePhoneNumber"
              value={form.alternatePhoneNumber || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.alternatePhoneNumber && <span className="error">{errors.alternatePhoneNumber}</span>}
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              max={new Date().toISOString().split("T")[0]} // 🚫 restrict future dates
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
          </div>


          {/* Column 3 */}
          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleProfileChange}
              disabled={!editMode}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label>Street:</label>
            <input
              name="street"
              value={form.street || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              maxLength={30}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.street && <span className="error">{errors.street}</span>}
          </div>

          <div className="form-group">
            <label>City:</label>
            <input
              name="city"
              value={form.city || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>State:</label>
            <input
              name="state"
              value={form.state || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.state && <span className="error">{errors.state}</span>}
          </div>

          <div className="form-group">
            <label>Pincode:</label>
            <input
              name="pincode"
              value={form.pincode || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              maxLength={6}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
          </div>

          <div className="form-group">
            <label>Country:</label>
            <input
              name="country"
              value={form.country || ""}
              onChange={handleProfileChange}
              readOnly={!editMode}
              maxLength={30}
              style={{ backgroundColor: editMode ? "white" : "#eee" }}
            />
            {errors.country && <span className="error">{errors.country}</span>}
          </div>

          <div className="form-group">
            <label>Role:</label>
            <input value={user.role || ""} readOnly style={{ backgroundColor: "#eee" }} />
          </div>
        </form>


        <div style={{ marginTop: "1rem" }}>
          {editMode ? (
            <>
              <button className="save" onClick={saveProfile}>Save Changes</button>
              <button
                className="cancel"
                onClick={() => {
                  setForm({ ...user });  // 🔄 Reset unsaved form changes
                  setEditMode(false);    // 🔐 Exit edit mode
                }}
              >
                Cancel
              </button>

            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      {/* PASSWORD SECTION */}
      <div className="profile-card">
        <h3>🔐 Change Password</h3>
        {passwordEditMode ? (
          <>
            <div className="password-row">
              <div className="password-form-group">
                <label>New Password:</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="password-form-group">
                <label>Confirm Password:</label>
                <div className="password-field">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <span onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

              </div>

              <div className="password-button-row">
                <button className="save" onClick={savePassword}>Save</button>
                <button
                  className="cancel"
                  onClick={() => {
                    setPasswordForm({ password: "", confirmPassword: "" }); // 🔄 Clear fields
                    setErrors({});                                           // 🧽 Clear errors
                    setPasswordEditMode(false);                              // 🔐 Exit edit mode
                  }}
                >
                  Cancel
                </button>

              </div>
            </div>
          </>
        ) : (
          <button className="edit-btn" onClick={() => setPasswordEditMode(true)}>Edit Password</button>
        )}
      </div>
    </div>
  );
}

export default CustomerProfile;
