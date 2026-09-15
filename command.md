Baca file `postman.json` yang ada di project ini dan migrasikan seluruh dokumentasi API ke `docs/openapi.yaml` menggunakan spesifikasi OpenAPI 3.x.

### Ketentuan WAJIB: ###

1. Jadikan file `postman.json` sebagai sumber kebenaran (source of truth).
2. Dokumentasikan SELURUH endpoint yang terdapat di file `postman.json`, termasuk endpoint yang berada di dalam folder/subfolder.
3. Untuk setiap endpoint, pertahankan:

   * HTTP method
   * path/URL
   * path parameter
   * query parameter
   * request body
   * request headers
   * authentication/security requirement
   * response body
   * HTTP status code
   * description yang tersedia di `postman.json`
4. HTTP status code di OpenAPI HARUS sama dengan status code yang terdokumentasi/terdefinisi di `postman.json`.
5. Struktur response HARUS mengikuti response yang ada di `postman.json`.

   * Jangan menambahkan field yang tidak ada.
   * Jangan menghapus field yang ada.
   * Jangan mengubah nama field.
   * Jangan mengubah tipe data field jika dapat diketahui dari response `postman.json`.
   * Pertahankan struktur nested object dan array.
6. Jika satu endpoint memiliki beberapa response dengan HTTP status code berbeda, dokumentasikan semuanya.
   Contoh:

   * 200 success
   * 400 validation error
   * 401 unauthorized
   * 404 not found
   * 500 internal server error
     Hanya dokumentasikan status code yang memang terdapat pada dokumentasi/response `postman.json`.
7. Jangan mengarang HTTP status code atau response baru berdasarkan asumsi/konvensi REST API.
8. Jika informasi tertentu tidak tersedia di `postman.json`, jangan mengarang nilainya. Gunakan informasi yang dapat disimpulkan secara aman dari request/response atau biarkan bagian tersebut tidak terdokumentasi.
9. Jika `postman.json` menggunakan environment variable seperti:

   * `{{base_url}}`
   * `{{access_token}}`
   * `{{user_id}}`
     pertahankan konsep variable tersebut dan sesuaikan ke format OpenAPI yang tepat.
10. Untuk bearer authentication, buat `securitySchemes` yang sesuai dan gunakan pada endpoint yang memang membutuhkan authentication.
11. Jika terdapat contoh response di `postman.json`, gunakan contoh tersebut sebagai `example` di OpenAPI.
12. Jika terdapat response schema yang dapat ditentukan dari contoh response, dokumentasikan schema tersebut tanpa mengubah struktur aslinya.
13. Jika response berupa array, pastikan OpenAPI mendokumentasikannya sebagai array.
14. Jika response berupa object nested, pertahankan nesting tersebut.
15. Jika terdapat nullable/null value, dokumentasikan sesuai kondisi response `postman.json`.
16. Jika request menggunakan JSON body, dokumentasikan `requestBody` dengan `application/json`.
17. Jika menggunakan query parameter, dokumentasikan di `parameters` dengan `in: query`.
18. Jika menggunakan path parameter, dokumentasikan di `parameters` dengan `in: path` dan `required: true`.
19. Jika menggunakan header tertentu, dokumentasikan di `parameters` dengan `in: header`, kecuali header tersebut lebih tepat direpresentasikan melalui `securitySchemes`.
20. Gunakan `components.schemas` secara reusable jika beberapa endpoint memiliki struktur request/response yang sama. Namun, penggunaan `$ref` tidak boleh mengubah struktur response yang sebenarnya.
21. Jangan mengubah behavior API. File OpenAPI hanya mendokumentasikan API yang sudah ada.
22. Jangan membuat endpoint baru.
23. Jangan menghapus endpoint yang ada.
24. Jangan mengubah HTTP method atau URL endpoint.
25. Jangan mengubah HTTP status code hanya karena menurut standar REST seharusnya menggunakan status code lain.


### Setelah selesai: ###

1. Tulis hasil dokumentasi ke:
   `docs/openapi.yaml`
2. Validasi YAML dan struktur OpenAPI.
3. Pastikan semua endpoint dari `postman.json` sudah memiliki dokumentasi di OpenAPI.
4. Pastikan setiap HTTP status code yang terdokumentasi di `postman.json` juga terdapat di OpenAPI.
5. Pastikan contoh response dan schema tidak berbeda dari response `postman.json`.
6. Jika menemukan informasi yang ambigu atau tidak dapat dipastikan dari `postman.json`, jangan menebak. Berikan daftar bagian tersebut setelah selesai.
7. Jangan mengubah source file `postman.json`.
8. Jangan mengubah source code aplikasi.

Sebelum melakukan perubahan, analisis terlebih dahulu struktur collection `postman.json` agar tidak ada endpoint, request, atau response yang terlewat.


### Setelah `docs/openapi.yaml` dibuat, lakukan audit antara `postman.json` dan OpenAPI. ###

Buat pemeriksaan berikut:

* Setiap endpoint `postman.json` harus memiliki pasangan `path + HTTP method` di OpenAPI.
* Setiap endpoint OpenAPI harus berasal dari endpoint yang ada di `postman.json`.
* Bandingkan seluruh HTTP status code per endpoint.
* Bandingkan struktur setiap response.
* Bandingkan nama property response.
* Bandingkan tipe data property response.
* Bandingkan nested object dan array.
* Bandingkan request body.
* Bandingkan query parameter.
* Bandingkan path parameter.
* Bandingkan authentication requirement.

Jika terdapat perbedaan, prioritaskan data dari `postman.json` dan perbaiki `docs/openapi.yaml`.

Jangan menganggap HTTP status code berdasarkan best practice. Gunakan status code yang benar-benar terdapat pada dokumentasi/response `postman.json`.


### Di akhir, tampilkan ringkasan: ###

* Total endpoint `postman.json`
* Total endpoint OpenAPI
* Endpoint yang berhasil dimigrasikan
* Endpoint yang tidak ditemukan
* Endpoint dengan perbedaan HTTP status code
* Endpoint dengan perbedaan response structure
* Informasi yang tidak dapat ditentukan dari `postman.json`
