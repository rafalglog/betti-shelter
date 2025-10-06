# Animal Shelter and Operations platform

## Project Description

This is an open-source, full-featured web application designed to be a comprehensive, end-to-end platform for animal shelters and rescue organizations. It moves beyond a simple pet listing site to provide a robust operational backbone for managing the entire lifecycle of an animal, from intake to outcome.

The platform features a public-facing portal for potential adopters and a powerful, permission-controlled dashboard for staff and volunteers to manage all aspects of shelter operations with a focus on data integrity and workflow automation.

---

## Core Features

The application is built around distinct, interconnected modules that handle the complex needs of a modern animal shelter.

### Animal Lifecycle Management

The system meticulously tracks an animal's entire journey through the shelter.

* **Intake Processing**: Handles various intake scenarios, including **owner surrenders**, **strays**, and **transfers** from partner organizations. It captures detailed information about the animal's origin and the people involved.
* **Re-Intake Workflow**: Provides a dedicated process for animals returning to the shelter. It automatically reactivates archived animal profiles, resets their status to `DRAFT`, and logs a new intake event, preserving the animal's complete history.
* **Outcome Management**: Manages all possible outcomes, including **adoptions**, **transfers out**, and **return-to-owner**. The system ensures data consistency with atomic operations. For example, processing an adoption:
    1.  Archives the animal's public profile.
    2.  Sets the appropriate `archiveReason` (e.g., `ADOPTED_INTERNAL`).
    3.  Updates the winning adoption application's status to `ADOPTED`.
    4.  **Automatically rejects all other open applications** for that animal, preventing conflicts and saving administrative time.

### Comprehensive Animal Profiles

Each animal has a rich, detailed profile that serves as the central hub for all its information. Staff can manage:

* **Core Details**: Update fundamental information like name, species, breed, age, weight, photos, and microchip number.
* **Characteristics Tagging**: Assign filterable tags (e.g., "Good with Kids," "Housebroken," "Heartworm Positive") to help match animals with suitable adopters. The system intelligently handles adding and removing tags in a single operation.
* **Dynamic Assessments**: Conduct standardized assessments (e.g., behavioral evaluations, medical intake exams) using **customizable templates**. The application dynamically generates forms and validation based on the selected template, ensuring consistent data collection.
* **Notes & History**: Add categorized notes (`BEHAVIORAL`, `MEDICAL`, `GENERAL`) to an animal's record. A full history of an animal's journey, status changes, and key events is logged automatically.
* **Task Management**: Create, assign, and track tasks related to a specific animal, such as "Administer medication," "Schedule vet visit," or "Behavioral follow-up." Tasks have statuses, priorities, and optional due dates.

### Adoption Application Workflow

The platform includes a complete system for managing adoption applications for both applicants and staff.

* **Public Application Portal**: Potential adopters can browse published animals, "like" their favorites, and submit detailed adoption applications directly through the platform.
* **Applicant Dashboard**: Applicants can view their submitted applications, edit them (if still pending), or withdraw them. They can also reactivate a previously withdrawn application if the animal becomes available again.
* **Staff Review & Management**: Staff have a dedicated dashboard to review and manage all incoming applications. Key features include:
    * **Status Management**: Update an application's status (`REVIEWING`, `APPROVED`, `REJECTED`, etc.) with a required reason for the change, creating a clear audit trail.
    * **Atomic Status Changes**: Approving an application automatically changes the animal's listing status to `PENDING_ADOPTION`, making it unavailable for new applications and preventing double-adoptions. If that application is later withdrawn or rejected, the system automatically makes the animal available again by setting its status back to `PUBLISHED`.
    * **Internal Notes**: Staff can add private notes to an application during the review process.

### User & Data Integrity

The system is built with security and data consistency as top priorities.

* **Role-Based Access Control (RBAC)**: Actions are protected by a permission system (`RequirePermission`). This ensures that only authorized users (e.g., `STAFF`, `ADMIN`) can perform sensitive operations like updating animal records or managing applications.
* **Transactional Integrity**: Critical multi-step database operations are wrapped in **Prisma transactions**. This guarantees that all steps in a process (like an adoption or intake) either complete successfully or fail together, preventing the database from ever being left in an inconsistent state.
* **Soft Deletes**: Important records like notes and assessments are soft-deleted rather than being permanently erased, preserving historical data for auditing and potential restoration.

## Tech Stack

- **Framework**: Next.js (React)
- **Backend**: Node.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Auth.js
- **Containerization**: Docker

## Screenshots

Here are some screenshots of the app:

<a href="public/screenshots/homepage.jpg" target="_blank">
  <img src="public/screenshots/homepage.jpg" alt="Homepage" width="600"/>
</a>
<p><em>Caption: Homepage</em></p>

<a href="public/screenshots/publicPetList.jpg" target="_blank">
  <img src="public/screenshots/publicPetList.jpg" alt="PublicPets" width="600"/>
</a>
<p><em>Caption: Showing available pets for adoption.</em></p>

<a href="public/screenshots/publicPetDetails.jpg" target="_blank">
  <img src="public/screenshots/publicPetDetails.jpg" alt="PublicPetDetails" width="600"/>
</a>

<p><em>Caption: Showing pet information.</em></p>

<a href="public/screenshots/dashboardHome.jpg" target="_blank">
  <img src="public/screenshots/dashboardHome.jpg" alt="DashboardHome" width="600"/>
</a>
<p><em>Caption: Admin dashboard homepage.</em></p>

<a href="public/screenshots/dashboardPets.jpg" target="_blank">
  <img src="public/screenshots/dashboardPets.jpg" alt="DashboardPets" width="600"/>
</a>
<p><em>Caption: Admin dashboard for managing pets.</em></p>

<a href="public/screenshots/dashboardEditPet.jpg" target="_blank">
  <img src="public/screenshots/dashboardEditPet.jpg" alt="DashboardEditPet" width="600"/>
</a>
<p><em>Caption: Admin dashboard: form for editing pet information.</em></p>

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `AUTH_SECRET`: A secret key for authentication. You can generate a secret key by running the command `openssl rand -base64 32` in your terminal. Ensure OpenSSL is installed:
  - **macOS/Linux**: OpenSSL is usually pre-installed. Verify by running `openssl version`.
  - **Windows**: Install OpenSSL from the [OpenSSL website](https://www.openssl.org/) or using [Chocolatey](https://chocolatey.org/) with the command `choco install openssl`.
- `AUTH_GITHUB_ID` (optional): Your GitHub OAuth client ID. Obtain this from your GitHub Developer settings.
- `AUTH_GITHUB_SECRET` (optional): Your GitHub OAuth client secret. Obtain this from your GitHub Developer settings.
- `AUTH_TRUST_HOST`: Set to `true` or `false` to indicate whether to trust the host for authentication.
- `POSTGRES_USER`: The PostgreSQL database username.
- `POSTGRES_PASSWORD`: The PostgreSQL database password.
- `POSTGRES_HOST`: The PostgreSQL database host. Use `localhost` for local development or the Docker Compose service name `postgres`.
- `POSTGRES_DB`: The PostgreSQL database name.
- `POSTGRES_PORT`: The PostgreSQL database port.
- `POSTGRES_URL`: The PostgreSQL connection URL, which is constructed using the above variables.

## Admin Dashboard Access

To test the admin dashboard, use the following credentials:

- **Username:** admin@example.com
- **Password:** admin123

## Running the App

### Run Locally

To run the app in a Docker container, follow these steps:

1. Clone the repository
   ```sh
   git clone https://github.com/albdangarcia/animal-shelter.git
   ```
1. Navigate to the project directory
   ```shell
   cd animal-shelter
   ```
1. Copy the `.env.example` file to `.env`:
   ```sh
   cp .env.example .env
   ```
1. Download the official PostgreSQL image from Docker Hub:
   ```sh
   docker pull postgres
   ```
1. Start the PostgreSQL container (This step starts a new PostgreSQL container with the specified password and user): 
   ```sh
   docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
   ```
1. Install the dependencies:
   ```sh
   npm install
   ```
1. Push the Prisma schema to the database:
   ```sh
   npx prisma db push
   ```
1. Push the Prisma schema to the database:
   ```sh
   npx prisma generate
   ```
1. Seed the database:
   ```sh
   npx prisma db seed
   ```
1. Run the app:
   ```sh
   npm run dev
   ```

### Using Docker

To run the app in a Docker container, follow these steps:

1. Clone the repository
   ```sh
   git clone https://github.com/albdangarcia/animal-shelter.git
   ```
1. Navigate to the project directory
   ```shell
   cd animal-shelter
   ```
1. Copy the `.env.example` file to `.env`:
    ```sh
    cp .env.example .env
    ```
1. Build the Docker image:
    ```sh
    docker compose build
    ```
1. Run the Docker container:
    ```sh 
    docker compose up
    ```
1. Open your browser and navigate to `http://localhost:3000`

## Contributing

Please follow these steps to contribute:

1. Fork the repository.
1. Create a new branch:
    ```sh
    git checkout -b feature/your-feature-name
    ```
1. Make your changes and commit them:
    ```sh
    git commit -m 'Add some feature'
    ```
1. Push to the branch:
    ```sh
    git push origin feature/your-feature-name
    ```
1. Open a pull request.

## Credits

I would like to give credit to the authors of the royalty-free images used in this project:

- Image of a dog displayed on the homepage by [Brett Sayles](https://www.pexels.com/@brett-sayles/)
- The rest of the pet images by [Pixabay](https://pixabay.com/)

## License

This project is licensed under the MIT License.