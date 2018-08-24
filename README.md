# serverless-watchlist
Test project to create a fully server-less application on AWS combining S3, Lambda, API Gateway and DynamoDB


### Current Tech
- **Lambdas**: Serverless framework used to manage and deploy to AWS
- **Lambdas**: serverless-webpack used to optimise uploaded code 
- **API Gateway**: configured manually
- **DynamoDB**: table created manually
- **IAM**: Custom IAM role in serverless config to provide access to specific DynamoDB table 


### Exposed endpoints:
- **GET: /omdb/search/{query}/{page}**  
  Queries OMDB database with path parameter as search term
  
- **GET: /imdb/scrape**
  Scrapes my personal IMDB watchlist data
  
- **GET: /watchlist**  
  Retrieves all watchlist items.  
  Results are currently **not** paginated or limited
  
- **POST: /watchlist**  
  Add a new item to the watchlist  
  Must contain 'id' param in json post body  
  Returns **400 error** when item already exists
  
- **GET: /watchlist/{item}**  
  Retrieves details of specified item  
  Returns **400 error** when item does not exist

- **DELETE: /watchlist/{item}**  
  Removes the specified item from the watchlist  
  Returns **400 error** when item does not exist


### Feature Roadmap

- Create simple UI to manage watchlist and add items directly from OMDB search results
- Add CF script to create the DynamoDB table
- Add CF script to define and configure the API Gateway endpoints
