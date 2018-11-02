docker run -dit -w /app -p 3000:3000 --mount type=bind,source=$(pwd),target=/app --name recom_dev node bash
