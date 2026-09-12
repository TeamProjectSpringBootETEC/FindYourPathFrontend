# AI Agent Guide

This is the canonical project guide for AI coding agents (Claude Code, OpenAI Codex, opencode,
GitHub Copilot, Google Antigravity, etc.). Tool-specific config files (`CLAUDE.md`, `AGENTS.md`,
`.github/copilot-instructions.md`) all point back here — this file is the single source of truth.
Update this file when conventions change; keep the pointer files short.

## Project overview

FindYourPath — a recruitment/job platform REST API.

- **Language / runtime:** Java 21
- **Framework:** Spring Boot 4.0.8-SNAPSHOT (spring-boot-starter-parent)
- **Persistence:** Spring Data JPA + MySQL (`mysql-connector-j`)
- **Validation:** spring-boot-starter-validation (Jakarta Bean Validation)
- **API docs:** springdoc-openapi-starter-webmvc-ui v3.0.2 (Swagger UI)
- **File/image hosting:** Cloudinary (`cloudinary-http5` v2.4.0)
- **PDF parsing:** Apache PDFBox 3.0.3 (CV text extraction)
- **Email:** spring-boot-starter-mail (JavaMailSender, SMTP via Gmail)
- **Security:** spring-security-crypto only (BCrypt `PasswordEncoder` — no full Spring Security filter chain)
- **Boilerplate:** Lombok
- **Build tool:** Maven 3.9.16 (use the `./mvnw` wrapper, not a system-wide `mvn`)
- **Base package:** `com.example.spring_boot_project_api`

## Build, run, test

```bash
./mvnw clean compile        # compile
./mvnw spring-boot:run       # run the app locally (http://localhost:8080)
./mvnw test                  # run tests
./mvnw clean package         # build the jar
```

Swagger UI is available at `/swagger-ui.html` once the app is running.

## Folder structure

```
src/main/java/com/example/spring_boot_project_api/
├── SpringBootProjectApiApplication.java   # main entry point
├── config/            # @Configuration classes
│                        (WebConfig [CORS], PasswordConfig [BCrypt],
│                         GeminiConfig [RestTemplate], CloudinaryConfig)
├── controller/        # @RestController — HTTP layer only, delegates to service
│                        (ApplicationController, ApplicationStatusHistoryController,
│                         CompanyController, CompanyReviewController, CvController,
│                         EventCategoryController, EventController,
│                         EventRegistrationController, JobController,
│                         JobCategoryController, NotificationController,
│                         SavedJobController, SkillController,
│                         StudentProfileController, UserController)
├── dto/
│   ├── request/       # inbound request payloads (validated with jakarta.validation)
│   │                    (ApplicationRequestDTO, ApplicationStatusHistoryRequestDTO,
│   │                     CompanyRequestDTO, CompanyReviewRequestDTO,
│   │                     EducationRequestDTO, EventCategoryRequestDTO,
│   │                     EventRegistrationRequestDTO, EventRequestDTO,
│   │                     ExperienceRequestDTO, JobApplicationRequestDTO,
│   │                     JobCategoriesRequestDTO, JobRequestDTO,
│   │                     NotificationRequestDTO, SavedJobRequestDTO,
│   │                     SkillRequestDTO, StudentProfileRequestDTO,
│   │                     UserRequestDTO)
│   └── response/      # outbound response payloads
│                        (ApplicationStatusHistoryResponseDTO,
│                         CompanyResponseDTO, CompanyReviewResponseDTO,
│                         CvParseResponseDTO, EducationResponseDTO,
│                         EventCategoryResponseDTO, EventRegistrationResponseDTO,
│                         EventResponseDTO, ExperienceResponseDTO,
│                         JobApplicationResponseDTO, JobCategoriesResponseDTO,
│                         JobResponseDTO, NotificationResponseDTO,
│                         SavedJobResponseDTO, SkillResponseDTO,
│                         StudentProfileResponseDTO, UserResponseDTO)
├── exception/         # custom exceptions + @RestControllerAdvice handler
│                        (GeminiApiException, GlobalExceptionHandler)
├── mapper/            # model <-> DTO conversion (@Component classes)
│                        (ApplicationMapper, ApplicationStatusHistoryMapper,
│                         CompanyMapper, CompanyReviewMapper,
│                         EventCategoryMapper, EventMapper,
│                         EventRegistrationMapper, JobCategoriesMapper,
│                         JobMapper, NotificationMapper, SavedJobMapper,
│                         SkillMapper, StudentProfileMapper, UserMapper)
├── model/             # @Entity JPA persistence models
│                        (ApplicationStatusHistory, Company, CompanyReview,
│                         Education, Event, EventCategory, EventRegistration,
│                         Experience, Job, JobApplication, JobCategories,
│                         Notification, Roles, SavedJob, Skills,
│                         StudentProfile, User)
├── repository/        # Spring Data JPA repositories
│                        (ApplicationStatusHistoryRepository, CompanyRepository,
│                         CompanyReviewRepository, EducationRepository,
│                         EventCategoryRepository, EventRegistrationRepository,
│                         EventRepository, ExperienceRepository,
│                         JobApplicationRepository, JobCategoriesRepository,
│                         JobRepository, NotificationRepository,
│                         RoleRepository, SavedJobRepository, SkillRepository,
│                         StudentProfileRepository, UserRepository)
├── service/           # concrete @Service classes (constructor injection)
│                        (ApplicationService, ApplicationStatusHistoryService,
│                         CloudinaryService, CompanyReviewService, CompanyService,
│                         EmailService, EventCategoryService, EventService,
│                         EventRegistrationService, GeminiService,
│                         JobCategoriesService, JobService,
│                         NotificationService, SavedJobService, SkillService,
│                         StudentProfileService, UserService)
└── util/              # stateless helpers/constants (empty — add when needed)

src/test/java/com/example/spring_boot_project_api/
├── SpringBootProjectApiApplicationTests.java   # context-loads smoke test only
├── controller/         # (scaffolded, no tests yet)
├── repository/         # (scaffolded, no tests yet)
└── service/            # (scaffolded, no tests yet)

src/main/resources/
├── application.properties       # DB, Cloudinary, Gemini, Mail config
├── static/index.html            # CV Auto-Fill & Submit demo SPA
├── static/test.html             # Test UI for SavedJobs, EventRegistrations, Notifications
└── templates/                   # (empty)
```

## Conventions

- **Layering:** `controller` → `service` → `repository`. Controllers never touch entities or
  repositories directly; they work with DTOs and call services.
- **DTOs:** never expose JPA `model` classes directly over the API — always map to a
  `dto/request` or `dto/response` type via the `mapper` package. Response DTOs flatten
  related entities (e.g. `companyId`, `companyName` instead of an entity reference).
- **Services:** concrete `@Service` classes with constructor injection. Some use
  `@RequiredArgsConstructor` (Lombok), others use hand-written constructors — ideally
  standardize on `@RequiredArgsConstructor` for new services.
- **Errors:** throw specific exceptions from `exception/`, handled centrally by
  `GlobalExceptionHandler` (`@RestControllerAdvice`). Current services throw plain
  `RuntimeException` with descriptive messages — these should eventually be replaced by
  dedicated exception classes. `GeminiApiException` already carries an `HttpStatus`.
- **Validation:** use `jakarta.validation` annotations on request DTOs (`@NotBlank`,
  `@NotNull`, `@Size`, `@Email`, `@Digits`, `@Min`/`@Max`, nested `@Valid`); let Spring's
  validation handle rejection rather than manual null-checks in controllers.
- **Lombok:** use `@Data` on models and DTOs; `@Component` on mappers; prefer
  `@Getter/@Setter/@Builder/@RequiredArgsConstructor` over hand-written boilerplate.
  Use constructor injection (via `@RequiredArgsConstructor`) instead of `@Autowired`
  field injection.
- **`@Transactional`:** applied at class level on CRUD services (`@Transactional(readOnly = true)`
  by default, overriding with `@Transactional` on write methods) or at method level for
  finer control.
- **Config:** database connection and environment-specific settings belong in
  `application.properties` (or profile-specific `application-{profile}.properties`), not
  hardcoded in Java. Third-party credentials (Cloudinary, Gemini) are injected via `@Value`.
- **Mapper pattern:** each mapper has three methods — `toEntity(RequestDTO)`,
  `updateEntity(Entity, RequestDTO)` (null-guarded per-field for partial updates),
  `toResponseDTO(Entity)`. Specialized mappers (e.g. `ApplicationMapper`) may build
  multiple entities.
- **Naming:** `<Resource>Controller / <Resource>Service / <Resource>Repository /
  <Resource>Mapper / <Resource>RequestDTO / <Resource>ResponseDTO`.
  Entities use plural table names (`jobs`, `users`, `events`, `job_categories`,
  `event_categories`, `companies`, `company_reviews`, `experiences`, `educations`,
  `roles`, `skills`, `student_profiles`, `job_applications`, `saved_jobs`,
  `event_registrations`, `notifications`, `application_status_histories`).

## Database & schema

- **Database:** MySQL, schema `findyourpath` at `localhost:3306` (see
  `application.properties`; no password configured locally).
- **Schema management:** `spring.jpa.hibernate.ddl-auto=update`. Hibernate creates missing
  tables but **never alters existing columns** — it will not add `AUTO_INCREMENT`,
  `NOT NULL`, or unique constraints to a table that already exists.
- **ID generation:** all entities use `@GeneratedValue(strategy = GenerationType.IDENTITY)`,
  which relies on the DB column being `AUTO_INCREMENT`.

### Gotcha: "Field 'id' doesn't have a default value"

If inserts fail with `could not execute statement [Field 'id' doesn't have a default value]`,
the table was created without `AUTO_INCREMENT` (typically created manually or by an earlier
entity version that lacked `@GeneratedValue`). Fix it in MySQL:

```sql
ALTER TABLE <table_name> MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;
```

(or drop the table and restart the app so Hibernate recreates it). Check sibling tables for
the same problem — they were likely created the same way.

## Notes for agents

- Don't add a new architectural layer or dependency unless the task actually needs it.
- Keep controller methods thin; business logic belongs in the service layer.
- When adding a new resource (e.g. `Product`), create matching files across `model`,
  `repository`, `dto/request`, `dto/response`, `mapper`, `service`, and `controller` —
  don't skip the DTO/mapper layer "just this once."
- Run `./mvnw test` before considering a change complete.
- When writing new services, use `@RequiredArgsConstructor` for constructor injection
  to stay consistent with the preferred pattern.
- Don't commit credentials or secrets. If you see them in `application.properties`,
  flag it but don't remove them unless asked (they may be intentional local dev values).

## Business features & cross-service behavior

- **Job posting → notifications:** when a company creates a job (`JobService.createJob`),
  the service loops over all users via `UserRepository.findAll()` and creates a
  `NEW_JOB` notification for each one.
- **Event registration:** users register for events; duplicates are prevented by a
  unique constraint on `(user_id, event_id)`. Cancellation deletes the record.
- **Saved jobs:** students save jobs for later; duplicates are prevented by a unique
  constraint on `(student_id, job_id)`.
- **Application status history:** when a new history record is created via
  `ApplicationStatusHistoryService.createHistory`, it also updates the parent
  `job_applications.status` field to keep them in sync.
- **Notifications:** support `is_read` boolean, bulk mark-all-as-read per user,
  and unread-only filtering.

### Entity relationships

```
User ──< Roles                    (ManyToOne)
Company ──< Job                   (ManyToOne)
Company ──< Event                 (ManyToOne)
JobCategories ──< Job             (ManyToOne)
EventCategory ──< Event           (ManyToOne)
StudentProfile ──< User           (OneToOne)
StudentProfile ──< JobApplication (OneToMany)
Job ──< JobApplication            (OneToMany)
User ──< SavedJob                 (OneToMany, unique: student_id + job_id)
Job ──< SavedJob                  (OneToMany)
User ──< EventRegistration        (OneToMany, unique: user_id + event_id)
Event ──< EventRegistration       (OneToMany)
User ──< Notification             (OneToMany)
JobApplication ──< ApplicationStatusHistory (OneToMany)
User ──< ApplicationStatusHistory (OneToMany, via changed_by)
```
