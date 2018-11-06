docker run -dit -p 3000:3000 -w /app --mount type=bind,source=$(pwd),target=/app --network rabbit-net --name recom_dev node bash
