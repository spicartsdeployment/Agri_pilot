# AgriPilot – Functional Requirement Document

## Project Name

**AgriPilot**

## User Roles

1. Farmer
2. Pilot
3. Drone Vendor

---

# 1. Authentication Module

## 1.1 Login Page

### Features

* Login using:

  * Phone Number
  * Password
* Forgot Password option
* Sign Up option

### Login Flow

1. User enters phone number and password.
2. System validates credentials.
3. On successful login, user is redirected to their respective dashboard:

   * Farmer Dashboard
   * Pilot Dashboard
   * Drone Vendor Dashboard

---

## 1.2 Sign Up Page

### Role Selection

User can select only one role:

* Farmer
* Pilot
* Drone Vendor

### Required Fields

* Full Name
* Phone Number
* Password
* Confirm Password

### Verification

* Phone number must be verified using OTP.
* Account is created after successful OTP verification.

---

# 2. Farmer Dashboard

## Bottom Navigation Tabs

1. Home
2. History
3. About
4. Settings

### Default Screen

Home page should open by default after login.

---

# 2.1 Home

## Top Navigation Bar

* Farmer Profile Icon
* Profile should be clickable
* Redirect to Profile Screen

## Weather Card

* Display Today's Weather
* Display Weekly Forecast
* Toggle between Today and Week view

## Farm Location Map Card

* Show all farmer land locations on map
* Clickable map markers

## Home Sub-Tabs

1. Book a Pilot
2. Jobs
3. Farms
4. Refer & Earn

---

## 2.1.1 Book a Pilot

### Flow

1. Display all registered farms.
2. Farmer can select only one farm.
3. Fill booking form.

### Booking Form Fields

* Farm Selection
* Service Type
* Fertilizer Quantity
* Date
* Time

### Booking Summary

* Estimated Cost
* Service Details

### Action Buttons

* Confirm Booking
* Cancel

---

## 2.1.2 Jobs

### Active Jobs Section

Display:

* Job ID
* Service Type
* Assigned Pilot
* Progress Status
* Scheduled Date

### Upcoming Jobs Section

Display:

* Upcoming Services
* Date & Time
* Assigned Pilot

### Job Tracking

* Click on job
* View live progress/status

---

## 2.1.3 Farms

### Top Actions

* Search Farm
* Add New Farm

### Farm List Details

Each farm should display:

* Farm Name
* Area Unit
* Crop Type
* Total Acres
* Land Type
* Crop Stage
* Water Source
* Location
* Notes (Optional)

### Actions

* Edit Farm
* Book Service
* Next/View Details

### Add Farm Form

Fields:

* Farm Name
* Area Unit
* Acres
* Crop Type
* Land Type
* Crop Stage
* Water Source
* Location
* Notes

---

## 2.1.4 Refer & Earn

### Features

* Referral Code
* Share Referral Link
* Refer Farmers
* Referral Reward Tracking

---

# 2.2 History

## Statistics Cards

Display:

* Total Bookings
* Total Acres Served
* Total Amount Spent

## Service History List

Display:

* Booking Date
* Service Type
* Pilot Name
* Amount

### Service Detail Screen

On clicking a history item:

Show:

* Complete Service Details
* Invoice
* Service Status

### Actions

* Leave Feedback
* Rate Service
* Rebook Service

---

# 2.3 About

### Contents

* About AgriPilot
* Services Offered
* Latest Updates
* Privacy Policy
* Terms & Conditions

---

# 2.4 Settings

### Menu Options

* Profile
* Theme
* Language
* Support
* Policies
* About
* Logout

All menu items must be clickable and open respective screens.

---

# 3. Drone Vendor Dashboard

## Bottom Navigation Tabs

1. Home
2. Drone
3. History
4. Settings

### Default Screen

Home page should open by default after login.

---

# 3.1 Home

## Top Navigation Bar

* Vendor Profile
* Clickable Profile Screen

## Drone Rental Requests

Display:

* Pilot Name
* Experience
* License Number
* Rental Duration
* Usage Reason
* Rental Cost

### Actions

* Accept Request
* Decline Request

---

# 3.2 Drone Module

## Top Section

* Search Drones
* Explore Drones

## Sub-Tabs

1. Rent Drone
2. Sell Drone

---

## 3.2.1 Rent Drone

### Drone Status Categories

* Available
* Booked
* Pending Requests

### Drone Details

Display:

* Drone Name
* Model
* Registration Number
* Rental Price
* Availability Status

### Actions

* Add Drone
* Edit Drone
* View Requests
* Accept Rental Request

---

## 3.2.2 Sell Drone

### Drone Sale Listing

Display:

* Drone Name
* Model
* Condition
* Selling Price

### Actions

* Add Drone for Sale
* Edit Listing
* Remove Listing
* View Buyer Requests

---

# 3.3 History

## Statistics Cards

Display:

* Total Rental Bookings
* Total Drone Sales
* Total Revenue

## Rental History

Display:

* Drone Name
* Pilot Name
* Rental Date
* Amount

## Sales History

Display:

* Drone Name
* Buyer Details
* Sale Date
* Amount

---

# 3.4 Settings

### Menu Options

* Profile
* Theme
* Language
* Subscription
* Policies
* Support
* About
* Logout

All menu items must be clickable and navigate to their respective screens.

---

# General System Requirements

## Notifications

* Booking Confirmation
* Rental Request Updates
* Service Completion Alerts
* Payment Notifications

## Profile Management

All users can:

* View Profile
* Edit Profile
* Change Password
* Update Phone Number

## Security

* OTP Verification
* Secure Authentication
* Password Encryption
* Role-Based Access Control

## Responsive Design

* Mobile Application
* Tablet Support
* Fast Loading Screens

## Navigation

* All buttons, tabs, and menu items must be functional and clickable.
* Proper screen routing should be implemented throughout the application.

---

# Dashboard Flow

Login → Role Selection Validation → Dashboard

Farmer Login → Farmer Dashboard

Drone Vendor Login → Drone Vendor Dashboard

Pilot Login → Pilot Dashboard (Separate Module)

End of Document.
