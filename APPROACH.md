# Approach to the Assessment

## Overview
This document outlines my approach to solving the assessment tasks. My focus was on writing clean, maintainable code while ensuring robust user experience and test coverage. Each step of the process was guided by an iterative approach, refining solutions based on edge cases and usability improvements.

---

## Development Process
### 1. **Initial Implementation: Minimum Viable Solution**
I started with the minimal required changes to refactor the **Product Card** component out of the main app component. The goal was to ensure separation of concerns and improve maintainability.
- Created a new **ProductCardComponent** using Angular CLI.
- Moved the relevant HTML and logic from `app.component.html` to `product-card.component.html` and `product-card.component.ts`.
- Ensured all necessary inputs and outputs were properly wired for communication with the parent component.
- Wrote **unit tests** to verify that the refactored component functioned as expected (e.g., displaying product details, emitting edit and delete events).

Preserving Form Data on Errors
- Removed the immediate form reset from the `onSubmit()` method in `ProductFormComponent`.
- The form is reset only after a successful call (in the parent component) using a reference to the form (`@ViewChild(ProductFormComponent)`).

This provided a solid foundation before diving deeper into refinements.

### 2. **Fixing Persistent Notification Display Issues**
During development, I noticed that the **error notification div** persisted indefinitely unless manually cleared. To improve user experience:

- Replaced the div with a NotificationService, which leverages **Angular Material Snackbar**, that disappears automatically after a few seconds (with plans to switch to a library like ngx-toastr if stacking is required).
- Modified the `AppComponent` to call `notificationService.showError` or `showSuccess` based on the error status.
- This prevented unnecessary UI clutter and made error messages more intuitive.

I ensured that relevant test cases were updated to verify that the snackbar was triggered appropriately.

### 3. **Handling Edge Cases in Validation**
While testing, I discovered that users could bypass input validation:

- By entering only whitespaces, thereby bypassing **min-length and required** conditions.
- By using **leading/trailing spaces**, which could lead to duplicate product names appearing as distinct values.

Instead of building separate custom validators for whitespace or trimmed minimum length, I chose to create a directive (`TrimDirective`) to automatically **trim input values on blur**. This ensured:

- The form control value is always sanitized before validation.
- Users cannot bypass required fields or minimum length constraints using spaces.
- Angular’s built-in validators can be used without modification.

### 4. **Sanitizing Product Data Before Submission**
To maintain data integrity, I built a **`sanitizeProduct` utility function** that:

- Trims leading/trailing spaces from product fields.
- Ensures uniform data storage and prevents edge cases where:
  - A product named **`test`** and another named **`test   `** would be treated as different entities.

This function is applied before calling the validateProduct function in create/update service functions, ensuring all products stored were **sanitized consistently**.

### 5. **Ensuring Meaningful Error Messages**
I identified three common error cases:

1. **Validation Error (Create)** → (400, "Validation failed")
2. **Validation Error (Update)** → (400, "Validation failed")
3. **Product Not Found (Updating Deleted Product)** → (404, "Product not found")

Initially, the **"Validation failed"** message was too generic. To provide better feedback:

- The error messages now explicitly state **which field caused the validation to fail**.
- The user is informed **why the product update failed**, particularly if the product was deleted before submission.

### 6. **Preventing Duplicate Actions on Save**
I noticed that the Create/Update button remained active, allowing multiple clicks while the save request was in progress. To prevent this:

- The button is disabled after clicking, by adding an `isSaving` flag in the `AppComponent` to manage the saving state and passing this flag to the `ProductFormComponent`.
- The label updates dynamically to **"Creating…"** or **"Updating…"** to indicate progress.
- Once the operation is complete, the button returns to its normal state.

This improved the user experience.

### 7. **Final UI Adjustments & Testing**
After implementing core functionality, I did manual testing to identify any remaining UI/UX issues. This included:

- Checking edge cases for form submission.
- Ensuring error messages were clear and actionable.
- Running test cases to confirm that validations and UI states behaved correctly.
- Completing any missing unit tests.
- Utilizing browser developer tools to debug UI issues and verify state changes in real-time.

---

## Conclusion
By taking an iterative approach—starting with a minimal viable implementation, refining based on edge cases, and continuously improving usability—I ensured that the application is both **functional and user-friendly**. 

My focus was not only on fulfilling the requirements but also on **enhancing user experience, improving maintainability, and writing comprehensive test cases**. The final solution demonstrates **clean architecture, proper validation handling, and a thoughtful UI/UX approach**, aligning with best practices in frontend development.

