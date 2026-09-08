# Authentication System Implementation

## Project Context

Saya memiliki project Backend menggunakan:

- Node.js
- Express.js
- Existing `User` module
- Existing User entity/model
- Existing Refresh Token entity/table
- Authentication menggunakan HTTP-only Cookie
- Refresh Token menggunakan mekanisme Rotation

Jangan mengubah arsitektur project secara besar-besaran.

Ikuti struktur, naming convention, coding style, dependency pattern, error handling, validation, response format, dan database/ORM pattern yang sudah digunakan oleh project.

---

# PHASE 1 — PELAJARI PROJECT TERLEBIH DAHULU

Sebelum membuat atau mengubah kode apa pun, pelajari struktur project secara menyeluruh.

## Command

> Pelajari project ini terlebih dahulu sebelum melakukan implementasi.
>
> Jangan membuat perubahan kode pada tahap ini.
>
> Analisis:
>
> 1. Struktur folder project.
> 2. Framework dan dependency yang digunakan.
> 3. ORM/database yang digunakan.
> 4. Struktur module yang sudah ada.
> 5. Implementasi `User` module.
> 6. User entity/model dan seluruh field-nya.
> 7. Controller pattern.
> 8. Service/use-case pattern.
> 9. Repository/data-access pattern jika ada.
> 10. Routing pattern.
> 11. Middleware pattern.
> 12. Validation pattern.
> 13. Error handling pattern.
> 14. Response/API format.
> 15. Authentication/authorization code jika sudah ada.
> 16. Configuration dan environment variable pattern.
> 17. Password hashing implementation jika sudah ada.
> 18. Migration pattern.
> 19. Testing pattern jika sudah ada.
> 20. Utility/helper yang sudah tersedia dan bisa digunakan kembali.
>
> Khusus `User` module, pahami:
>
> - field user
> - primary key
> - email/username yang digunakan untuk login
> - password field
> - status/active field
> - timestamp
> - relationship yang sudah ada
> - validation yang sudah ada
> - service yang sudah ada
>
> Jangan membuat asumsi jika informasi sudah tersedia di source code.
>
> Setelah selesai mempelajari project, berikan laporan:
>
> ### Project Architecture
>
> Jelaskan struktur arsitektur project saat ini.
>
> ### User Module
>
> Jelaskan bagaimana User module bekerja.
>
> ### Database
>
> Jelaskan ORM, entity/model, relationship, dan migration pattern.
>
> ### Existing Utilities
>
> Daftar helper/service/utility yang bisa digunakan untuk authentication.
>
> ### Authentication Impact
>
> Jelaskan file/module apa saja yang kemungkinan perlu dibuat atau diubah untuk sistem authentication.
>
> ### Potential Issues
>
> Jelaskan potensi konflik dengan architecture yang sudah ada.
>
> Jangan implementasikan apa pun sebelum laporan ini selesai.

---

# PHASE 2 — ANALISIS DESAIN AUTHENTICATION

Setelah memahami project, buat desain authentication yang mengikuti architecture existing project.

Authentication yang dibutuhkan:

1. Login
2. Refresh Token
3. Logout
4. My Profile
5. Update Profile
6. Change Password

Gunakan HTTP-only Cookie untuk authentication token.

---

## Refresh Token Table

Saya memiliki table/entity refresh token dengan struktur:

```text
id
user_id
token
expired_at
revoked_at
revoked_reason
replaced_by
device_idd
device_name
device_type
user_agent
ip_address
created_at
```

`revoked_reason` memiliki kemungkinan:

```text
logout
rotated
expired
security
```

`replaced_by` digunakan untuk menyimpan ID refresh token baru ketika terjadi rotation.

---

## Refresh Token Rotation

Gunakan konsep Refresh Token Rotation.

Flow yang diinginkan:

```text
LOGIN
  |
  v
Generate Access Token
  |
Generate Refresh Token
  |
  v
Save Refresh Token
  |
Set HTTP-only Cookie
```

Ketika refresh:

```text
Client
  |
  v
Refresh Token Cookie
  |
  v
Find Refresh Token
  |
  +---- tidak ditemukan ---> Unauthorized
  |
  +---- revoked -----------> Unauthorized
  |
  +---- expired ------------> Unauthorized
  |
  v
Generate new Access Token
Generate new Refresh Token
  |
  v
Revoke old Refresh Token
revokedReason = "rotated"
replacedBy = newRefreshToken.id
  |
  v
Save new Refresh Token
  |
  v
Replace HTTP-only Cookie
```

Jangan melakukan update token lama menjadi token baru.

Setiap rotation harus membuat record refresh token baru.

---

# PHASE 3 — SECURITY REQUIREMENTS

Implementasi authentication harus mengikuti prinsip security berikut.

## Access Token

Access Token:

- JWT
- lifetime pendek
- tidak disimpan di database
- digunakan untuk authorization
- dikirim melalui mekanisme yang sesuai dengan architecture project

Gunakan environment variable untuk:

```env
JWT_SECRET_KEY=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET_KEY=
JWT_REFRESH_EXPIRES_IN=
```

Jika project sudah memiliki configuration system, ikuti system tersebut daripada membuat configuration baru.

---

# Refresh Token

Refresh Token:

- JWT atau mekanisme token yang sesuai dengan architecture project
- disimpan di database
- dikirim menggunakan HTTP-only Cookie
- jangan disimpan di localStorage
- jangan disimpan di sessionStorage

Cookie harus mempertimbangkan:

```text
httpOnly
secure
sameSite
path
maxAge
```

Nilainya harus mengikuti environment/configuration project.

Jangan hard-code production configuration.

---

# Refresh Token Database

Saat membuat refresh token baru, simpan:

```text
user_id
token
expired_at
device_id
deviceN_name
device_type
user_agent
ip_address
created_at
```

Jangan menyimpan informasi yang tidak tersedia dari request.

Jika `device_id` membutuhkan informasi dari client, tentukan mekanisme yang aman dan konsisten dengan architecture project.

---

# Token Storage Security

Evaluasi apakah refresh token sebaiknya disimpan sebagai:

```text
plain token
```

atau:

```text
hashed token
```

Prioritaskan keamanan.

Jika token di-hash di database:

- cookie tetap berisi raw token
- database hanya menyimpan hash
- lookup/verification harus disesuaikan dengan implementasi hash

Jika existing architecture sudah menentukan pola token storage, ikuti architecture tersebut kecuali terdapat alasan security yang kuat untuk mengubahnya.

---

# PHASE 4 — AUTH MODULE

Buat module:

```text
auth
```

Ikuti struktur module yang digunakan oleh project.

Contoh struktur yang boleh digunakan hanya jika sesuai dengan project:

```text
auth/
├── auth.controller.js
├── auth.service.js
├── auth.routes.js
├── auth.validation.js
├── auth.middleware.js
└── ...
```

Jangan memaksakan struktur di atas jika project menggunakan struktur berbeda.

---

# ENDPOINT

Buat endpoint berikut.

## Login

```http
POST /auth/login
```

Request body menyesuaikan User module.

Contoh:

```json
{
	"email": "user@example.com",
	"password": "password"
}
```

Login harus:

1. Validate request.
2. Find user.
3. Verify password.
4. Verify user status jika project memiliki status.
5. Generate access token.
6. Generate refresh token.
7. Save refresh token.
8. Set refresh token HTTP-only Cookie.
9. Return response sesuai standard API project.

Jangan return password.

Jangan return refresh token raw di response body jika menggunakan HTTP-only Cookie.

---

# Refresh

```http
POST /auth/refresh
```

Refresh token dibaca dari HTTP-only Cookie.

Flow:

1. Ambil refresh token dari Cookie.
2. Jika tidak ada → Unauthorized.
3. Verify token.
4. Cari refresh token di database.
5. Pastikan token belum revoked.
6. Pastikan token belum expired.
7. Pastikan user masih valid.
8. Generate access token baru.
9. Generate refresh token baru.
10. Revoke refresh token lama.
11. Set:

```text
revoked_reason = rotated
replaced_by = newRefreshToken.id
```

12. Save refresh token baru.
13. Replace HTTP-only Cookie.
14. Return access token sesuai API design.

---

# Refresh Token Reuse Detection

Implementasikan protection terhadap refresh token reuse.

Contoh:

Jika refresh token A sudah:

```text
revoked_at = ...
revoked_reason = rotated
replaced_by = B
```

kemudian client mencoba menggunakan token A lagi, anggap sebagai kemungkinan token reuse/security incident.

Jangan sekadar membuat token baru.

Evaluasi apakah seluruh token chain/session milik user/device tersebut perlu direvoke dengan:

```text
revoked_reason = security
```

Gunakan pendekatan yang sesuai dengan architecture dan tingkat keamanan project.

Dokumentasikan keputusan tersebut.

---

# Logout

```http
POST /auth/logout
```

Logout harus:

1. Membaca refresh token dari Cookie.
2. Jika token ditemukan:
   - revoke token
   - set `revoked_at`
   - set:
     ```text
     revoked_reason = logout
     ```
3. Clear HTTP-only Cookie.
4. Return success response.

Logout sebaiknya tetap sukses jika Cookie sudah tidak tersedia.

---

# My Profile

```http
GET /auth/me
```

atau gunakan route yang mengikuti convention project.

Endpoint harus:

1. Membaca Access Token.
2. Authenticate user.
3. Mengambil user berdasarkan user ID dari token.
4. Return profile user.

Jangan return:

```text
password
password hash
refresh token
sensitive authentication information
```

Gunakan User service/repository yang sudah ada jika tersedia.

---

# Update Profile

```http
PATCH /auth/me
```

atau mengikuti convention project.

User hanya boleh mengubah field profile yang memang diperbolehkan.

Jangan izinkan user mengubah field security secara tidak sengaja, seperti:

```text
id
password
status
created_at
updated_at
```

kecuali memang secara eksplisit diperlukan oleh project.

Gunakan validation pattern yang sudah digunakan User module.

---

# Change Password

```http
PATCH /auth/change-password
```

Request:

```json
{
	"currentPassword": "old-password",
	"newPassword": "new-password",
	"confirmNewPassword": "confirm-new-password"
}
```

Flow:

1. Authenticate user.
2. Ambil user dari authenticated user ID.
3. Verify current password.
4. Validate new password.
5. Pastikan new password tidak sama dengan current password jika sesuai security policy.
6. Hash new password menggunakan mekanisme existing project.
7. Update password.
8. Revoke refresh token/session yang relevan untuk keamanan.

Untuk password change, default security behavior:

```text
revoke existing refresh tokens
revokedR_reason = security
```

Tujuannya agar session lama tidak tetap valid setelah password berubah.

Jangan mengubah password menggunakan plain text.

---

# PHASE 5 — AUTH MIDDLEWARE

Authentication menggunakan HTTP-only Cookie.

Jangan menggunakan:

```text
Authorization: Bearer <access-token>
```

untuk authentication utama, kecuali project existing memang sudah menggunakan pola tersebut dan terdapat alasan untuk mempertahankannya.

## Access Token Cookie

Access Token disimpan dalam HTTP-only Cookie.

Contoh konfigurasi:

```text
accessToken
```

Middleware authentication harus mengambil Access Token dari Cookie:

```js
req.cookies.accessToken;
```

Jika Access Token tidak tersedia:

```text
401 Unauthorized
```

Jika Access Token invalid atau expired:

```text
401 Unauthorized
```

Jangan menggunakan Refresh Token sebagai pengganti Access Token untuk mengakses protected endpoint.

---

## Authentication Middleware Flow

Flow:

```text
Request
   |
   v
Read accessToken from HTTP-only Cookie
   |
   +---- tidak ada ------> 401 Unauthorized
   |
   v
Verify JWT
   |
   +---- invalid --------> 401 Unauthorized
   |
   +---- expired --------> 401 Unauthorized
   |
   v
Extract user ID
   |
   v
Attach authenticated user information
   |
   v
next()
```

Contoh conceptual implementation:

```js
const accessToken = req.cookies.accessToken;

if (!accessToken) {
	throw new UnauthorizedError();
}

const payload = verifyAccessToken(accessToken);

req.user = {
	id: payload.sub,
};

next();
```

Sesuaikan implementasi dengan architecture dan error handling project.

---

# REFRESH TOKEN

Refresh Token juga disimpan dalam HTTP-only Cookie.

Contoh:

```text
refreshToken
```

Refresh endpoint:

```http
POST /auth/refresh
```

membaca:

```js
req.cookies.refreshToken;
```

Refresh Token hanya digunakan untuk mendapatkan Access Token baru.

Jangan menggunakan Refresh Token untuk authorization terhadap endpoint seperti:

```text
GET /auth/me
PATCH /auth/me
PATCH /auth/change-password
```

---

# COOKIE SEPARATION

Gunakan cookie terpisah untuk Access Token dan Refresh Token.

Contoh:

```text
accessToken
refreshToken
```

Recommended cookie path:

```text
accessToken
Path = /

refreshToken
Path = /auth/refresh
```

Jika `refreshToken` menggunakan path `/auth/refresh`, browser hanya akan mengirim Refresh Token ke endpoint tersebut.

Hal ini mengurangi exposure Refresh Token pada endpoint lain.

Namun pastikan konfigurasi ini kompatibel dengan routing project.

---

# LOGIN FLOW

Login:

```text
POST /auth/login
        |
        v
Validate credentials
        |
        v
Generate Access Token
        |
Generate Refresh Token
        |
        v
Save Refresh Token to DB
        |
        v
Set HTTP-only accessToken cookie
        |
Set HTTP-only refreshToken cookie
        |
        v
Return user/profile response
```

Jangan return Access Token atau Refresh Token melalui response body jika seluruh authentication token memang menggunakan HTTP-only Cookie.

---

# REFRESH FLOW

```text
POST /auth/refresh
        |
        v
Read refreshToken Cookie
        |
        v
Verify Refresh Token
        |
        v
Find token in database
        |
        +---- missing/revoked/expired
        |             |
        |             v
        |       401 Unauthorized
        |
        v
Generate new Access Token
Generate new Refresh Token
        |
        v
Revoke old Refresh Token
        |
        +-- revokedReason = rotated
        +-- replacedBy = new token ID
        |
        v
Save new Refresh Token
        |
        v
Replace accessToken Cookie
Replace refreshToken Cookie
```

---

# LOGOUT FLOW

```text
POST /auth/logout
        |
        v
Read refreshToken Cookie
        |
        v
Revoke Refresh Token
        |
        +-- revokedReason = logout
        |
        v
Clear accessToken Cookie
Clear refreshToken Cookie
        |
        v
Success
```

Jika Access Token masih valid tetapi user melakukan logout, jangan hanya menghapus Access Token Cookie.

Refresh Token juga harus direvoke agar session tidak dapat diperpanjang.

---

# CHANGE PASSWORD

Setelah password berhasil diubah:

```text
Revoke existing refresh tokens
  |
  +-- revokedReason = security
  |
  v
Clear authentication cookies
```

User kemudian harus login kembali.

Access Token yang sudah terlanjur diterbitkan tetap valid sampai expiration-nya jika menggunakan JWT stateless.

Jika project membutuhkan immediate access-token invalidation, jelaskan opsi dan trade-off-nya terlebih dahulu sebelum menambahkan mekanisme blacklist/token versioning.

---

# IMPORTANT

Authentication middleware hanya menggunakan:

```text
accessToken Cookie
```

Refresh middleware/service hanya menggunakan:

```text
refreshToken Cookie
```

Jangan mencampurkan keduanya.

Jangan membaca Refresh Token untuk authorization protected endpoint.

Jangan menyimpan token di:

```text
localStorage
sessionStorage
frontend JavaScript state
```

Token harus tetap berada di HTTP-only Cookie.

# PHASE 6 — COOKIE CONFIGURATION

Buat konfigurasi cookie melalui environment/configuration.

Contoh:

```env
AUTH_COOKIE_NAME=refreshToken
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_HTTP_ONLY=true
AUTH_COOKIE_SAME_SITE=lax
AUTH_COOKIE_MAX_AGE=...
```

Untuk production:

```text
secure = true
```

Sesuaikan `sameSite` dengan deployment architecture, terutama jika frontend dan backend berbeda domain.

Jangan hard-code secret atau production credentials.

---

# PHASE 7 — DEVICE INFORMATION

Refresh token table memiliki:

```text
deviceId
deviceName
deviceType
userAgent
ipAddress
```

Gunakan informasi request yang tersedia.

Implementasikan secara konsisten.

Contoh:

```text
userAgent
request.headers["user-agent"]

ipAddress
request.ip
```

Perhatikan konfigurasi Express:

```text
trust proxy
```

Jika project berjalan di belakang Nginx/load balancer/reverse proxy, pastikan IP client tidak salah dibaca.

Untuk:

```text
deviceId
deviceName
deviceType
```

jangan membuat asumsi tanpa dasar.

Jika belum ada mekanisme device identification di project, buat desain sederhana dan dokumentasikan konsekuensinya.

---

# PHASE 8 — DATABASE / ENTITY

Review existing Refresh Token entity.

Pastikan relationship:

```text
User
  |
  +---- RefreshToken
```

Jika menggunakan ORM, gunakan relationship yang sesuai dengan ORM project.

Pastikan field:

```text
user_id
token
expiredAt
revokedAt
revokedReason
replacedBy
deviceId
deviceName
deviceType
userAgent
ipAddress
created_at
```

mengikuti naming convention database yang sudah digunakan project.

Jangan membuat migration baru jika entity/table tersebut sudah tersedia dan sudah sesuai.

Jika terdapat ketidaksesuaian antara entity dan database, jelaskan terlebih dahulu sebelum mengubahnya.

---

# PHASE 9 — TRANSACTION

Refresh token rotation harus mempertimbangkan database transaction.

Operasi:

```text
revoke old token
+
create new token
```

sebaiknya dilakukan dalam satu transaction jika ORM/project mendukung.

Tujuannya agar tidak terjadi kondisi:

```text
old token revoked
new token gagal dibuat
```

atau sebaliknya.

Gunakan transaction pattern yang sudah digunakan project.

---

# PHASE 10 — ERROR HANDLING

Ikuti error handling existing project.

Minimal bedakan:

```text
Invalid credentials
Unauthorized
Invalid refresh token
Expired refresh token
Revoked refresh token
Refresh token reuse detected
User not found
Invalid current password
Validation error
```

Jangan memberikan error yang membocorkan informasi sensitif.

Untuk login, hindari response yang memungkinkan attacker mengetahui apakah:

```text
email ada
atau
email tidak ada
```

Jika sesuai dengan security standard project, gunakan pesan generic seperti:

```text
Invalid email or password
```

---

# PHASE 11 — RESPONSE FORMAT

Jangan membuat response format baru jika project sudah memiliki standard.

Ikuti format existing project.

Contoh conceptual response:

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"accessToken": "...",
		"user": {}
	}
}
```

Namun gunakan format aktual project, bukan contoh di atas jika project memiliki format berbeda.

Refresh token tidak boleh dikembalikan di response body ketika menggunakan HTTP-only Cookie.

---

# PHASE 12 — VALIDATION

Gunakan validation library dan pattern yang sudah digunakan project.

Minimal validation:

## Login

```text
email required
password required
```

## Change Password

```text
currentPassword required
newPassword required
newPassword password policy
```

## Update Profile

Gunakan validation dari User module jika tersedia.

Jangan menduplikasi validation logic tanpa alasan.

Jika terdapat reusable validation helper, gunakan helper tersebut.

---

# PHASE 13 — IMPLEMENTATION

Setelah seluruh analisis selesai:

1. Buat Auth module.
2. Buat controller.
3. Buat service.
4. Buat route.
5. Buat validation.
6. Buat middleware jika diperlukan.
7. Integrasikan User module.
8. Integrasikan Refresh Token entity.
9. Implementasikan JWT.
10. Implementasikan HTTP-only Cookie.
11. Implementasikan refresh token rotation.
12. Implementasikan logout.
13. Implementasikan profile.
14. Implementasikan update profile.
15. Implementasikan change password.
16. Tambahkan transaction.
17. Tambahkan error handling.
18. Tambahkan tests jika project memiliki testing infrastructure.

Gunakan dependency yang sudah tersedia terlebih dahulu.

Jangan menambahkan package baru jika functionality tersebut sudah tersedia.

Jika harus menambahkan dependency, jelaskan alasannya terlebih dahulu.

---

# PHASE 14 — TESTING

Buat test untuk minimal flow berikut.

## Login

- valid login
- invalid email
- invalid password
- inactive user jika ada
- validation error
- refresh cookie berhasil dibuat
- password tidak muncul dalam response

## Refresh

- valid refresh token
- missing cookie
- invalid token
- expired token
- revoked token
- rotation berhasil
- old token menjadi revoked
- `revokedReason = rotated`
- `replacedBy` menunjuk token baru
- refresh token reuse detection

## Logout

- logout dengan valid token
- logout tanpa cookie
- token menjadi revoked
- `revokedReason = logout`
- cookie dihapus

## My Profile

- authenticated user
- missing access token
- invalid access token
- expired access token
- user tidak ditemukan
- password tidak dikembalikan

## Update Profile

- valid update
- validation error
- unauthorized
- protected field tidak dapat diubah

## Change Password

- valid password change
- wrong current password
- invalid new password
- same password jika policy melarang
- refresh session direvoke
- password lama tidak dapat digunakan

---

# PHASE 15 — FINAL REVIEW

Setelah implementation selesai, lakukan review terhadap seluruh perubahan.

Periksa:

### Architecture

- Apakah mengikuti architecture existing?
- Apakah ada duplicate logic?
- Apakah module terlalu tightly coupled?

### Security

- Apakah refresh token menggunakan HTTP-only Cookie?
- Apakah Secure/SameSite benar?
- Apakah refresh token rotation benar?
- Apakah revoked token tidak dapat digunakan kembali?
- Apakah reuse detection tersedia?
- Apakah password selalu di-hash?
- Apakah secret menggunakan environment variable?
- Apakah sensitive data tidak dikembalikan?

### Database

- Apakah relationship benar?
- Apakah transaction digunakan untuk rotation?
- Apakah revokedReason benar?
- Apakah replacedBy benar?

### Code Quality

- Apakah controller tetap tipis?
- Apakah business logic berada di service?
- Apakah validation reusable?
- Apakah error handling mengikuti project?
- Apakah naming mengikuti project?
- Apakah tidak ada dead code?

### Testing

- Apakah authentication flow utama sudah dites?
- Apakah failure case sudah dites?
- Apakah token rotation sudah dites?
- Apakah logout dan password change sudah dites?

---

# IMPORTANT RULES

1. **Jangan langsung coding sebelum mempelajari project.**
2. Jangan mengubah architecture existing tanpa alasan.
3. Jangan membuat asumsi terhadap User entity.
4. Jangan membuat asumsi terhadap ORM.
5. Jangan membuat response format baru jika project sudah memiliki standard.
6. Jangan membuat validation pattern baru jika sudah ada reusable validation.
7. Jangan menyimpan refresh token di localStorage.
8. Jangan mengirim refresh token melalui response body.
9. Gunakan HTTP-only Cookie untuk refresh token.
10. Jangan return password/password hash.
11. Jangan menyimpan JWT secret di source code.
12. Gunakan environment/configuration existing.
13. Gunakan transaction untuk refresh token rotation jika didukung.
14. Set `revokedReason = rotated` ketika token di-rotate.
15. Set `revokedReason = logout` ketika logout.
16. Set `revokedReason = security` untuk security invalidation.
17. Jangan menghapus record refresh token ketika rotation/logout; gunakan revoke mechanism.
18. Jangan mengubah token lama menjadi token baru.
19. Rotation harus membuat refresh token record baru.
20. Sebelum menambahkan dependency baru, cek dependency yang sudah tersedia.
21. Jika ada keputusan architecture/security yang belum jelas, jelaskan terlebih dahulu dan jangan menebak.
22. Semua perubahan harus seminimal mungkin dan mengikuti pola project yang sudah ada.
23. Setelah implementasi, tampilkan daftar file yang dibuat/diubah dan jelaskan fungsi setiap file.
24. Tampilkan juga contoh API flow untuk:

- login
- refresh
- logout
- me
- update profile
- change password

25. Jangan menghapus atau merusak functionality existing.

---

# EXPECTED FINAL OUTPUT

Setelah selesai, berikan:

## 1. Architecture Summary

Ringkasan bagaimana Auth module terintegrasi dengan project.

## 2. Files Created

Daftar file baru.

## 3. Files Modified

Daftar file yang diubah.

## 4. Authentication Flow

Jelaskan:

```text
Login
Refresh Rotation
Logout
My Profile
Update Profile
Change Password
```

## 5. Security Considerations

Jelaskan security mechanism yang digunakan.

## 6. Environment Variables

Daftar environment variable yang diperlukan.

## 7. API Endpoints

Daftar endpoint beserta method dan authentication requirement.

## 8. Testing Result

Tampilkan test yang dibuat dan hasilnya.

## 9. Remaining Issues

Jika masih ada hal yang belum dapat diimplementasikan karena keterbatasan informasi project, jelaskan secara eksplisit.

Jangan menyatakan implementation selesai jika masih ada TODO penting.
