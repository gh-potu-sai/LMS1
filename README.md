
# 💰 Loan Management System 1

## 👨‍💻 Team Members:
- Golagana Vandana  
- Potu Purna Sai  
- Athikamsetti Janaki Ram  
- Aguru Sandeep  

---

## 🚀 Full Stack Setup Guide

### 📁 Project Structure:
```
LTIM_LMS_1_repo/
├── backend/       👉 Spring Boot (Java 21)
└── frontend/      👉 React
```

---

## 🔗 Clone the Repository
```bash
git clone https://github.com/Ft-Trumio/LTIM_LMS_1_repo.git
cd LTIM_LMS_1_repo
```

---

## 🔧 Prerequisites  
Ensure the following versions are installed:

- ✅ Java 21  
- ✅ Maven 3.8+  
- ✅ Node.js 18+  
- ✅ MySQL 8.x  

---

## 🔙 Backend Setup – Spring Boot

### ✅ Step 1: Navigate to the backend folder
```bash
cd backend
```

### ✅ Step 2: Configure the database  
Edit the file:
```
src/main/resources/application.properties
```

Paste the following config:
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/lms_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
app.admin.secret=${ADMIN_SECRET}
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
```

Then, create a new file for secrets:

#### 📁 `src/main/resources/application-secret.properties`
```properties
DB_USERNAME=root
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600000  # (e.g., 1 hour in milliseconds)

ADMIN_SECRET=supersecretkey
```

Make sure to include this secret file in your `application.properties`:
```properties
spring.config.import=application-secret.properties
```

### ✅ Step 3: Build and run the backend
```bash
mvn clean install
mvn spring-boot:run
```

🔗 **Backend running at:** [http://localhost:8081](http://localhost:8081)

---

## 🌐 Frontend Setup – React

### ✅ Step 1: Navigate to the frontend folder
```bash
cd ../frontend
```

### ✅ Step 2: Install project dependencies
```bash
npm install
```

### ✅ Step 3: Install additional packages
```bash
npm install react-toastify react-icons
```

### ✅ Step 4: Start the development server
```bash
npm start
```

🔗 **Frontend running at:** [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Project Features Summary

- ✅ User Login & Registration (Admin / Customer)  
- ✅ JWT Authentication  
- ✅ Role-based Dashboards  
- ✅ Protected Routes  
- ✅ Form Validation & Toast Notifications  
- ✅ Admin Key Verification  
- ✅ Clean Modular Code Structure:

---

## 🖼️ Application UI Screenshots

### 🏠 1. Home Page
![Home](https://github.com/user-attachments/assets/5a2c0279-deaa-45b9-9c69-1756cdad3eae)

### 💼 2. Loan Services Section
![Loan Services](https://github.com/user-attachments/assets/98ecfe4e-58f7-409e-853e-23c955696a4f)

### 📬 3. Contact Form Section
![Contact Form](https://github.com/user-attachments/assets/8cf46a84-8969-4a40-a633-980b859ed698)

### 📝 4. Registration Forms

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/97ae478c-d83d-42cf-95d6-c40e8f6ebbb4" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/d182a273-a8bd-499b-b5e2-7efe4005234c" width="100%"/></td>
  </tr>
</table>

### 🔐 5. Login Page
![Login](https://github.com/user-attachments/assets/4fd58cb8-2ba7-4f46-9878-54af08de27c2)

### 🔐 6. Emi Calculator Feature

The Loan Management System includes a built-in **EMI (Equated Monthly Installment) Calculator** accessible from the home page. Users can calculate estimated monthly payments based on:
- Selected **loan type**
- Desired **loan amount**
- **Loan duration** in months or years

It dynamically shows:
- 💸 Monthly EMI
- 📊 Interest rate based on loan type
- 📈 Total payable amount and principal breakdown

![Emi_Calculator](https://github.com/user-attachments/assets/762aa001-d409-4b99-b594-12ec64e826d0)

This allows users to plan finances better before applying for any loan, enhancing the platform's usability and transparency.

---


