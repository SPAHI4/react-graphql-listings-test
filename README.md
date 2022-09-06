# Airbnb Listings Explorer

Inside this repo is the skeleton of a simple web app that can serve up a local DB of listings from AirBnB. The goal is to build a way to search the listings and provide additional information for the average rating of the neighborhood.

## Repository Design

### Backend

The backend repo is a barebones GraphQL server that you can add new types and fields as necessary.

The `data/db.ts` contains a mock DB that loads data from a CSV file. The entire `db` directory should not need to be modified.

The `services/` directory contains the business logic that interacts with the DB. Feel free to modify this as needed.

The `schema/` directory contains the GraphQL schema that the client interacts with.

### Frontend

The frontend is a standard Create React App set up with Apollo Client.

The `pages/Listings.page.tsx/css` should be the main file you need to interact with to add the business logic.

In `types/listings.ts`, you have the basic Typescript type for the Listing.

## Instructions

Please implement the following additions to the application. Look at `screenshot.png` for an idea of what the final product should look like.

Add unit tests where reasonable (you don't need to test everything - just the more complex logic)

This project should take between 1-2 hours and if it takes longer, just write up what you would have done to finish it.

### 0. Set up

1. Run `yarn install` on backend / frontend modules
2. Run backend server with `yarn dev`
3. Run frontend React app with `yarn start`

### 1. Style cards

First, we want to style the listings so they look a bit better. We'd like to format them into a list of cards that we can view in a more succinct format. See `screenshot.png` for an idea of what it should look like. You don't need to be make it look pixel-perfect but just get the general style.

### 2. Add instant search

We'd like to add a search box so we can search for listings by their name, description, or neighbourhood (case-insensitive). However, we don't want to do the search on the client-side since it would require downloading the entire DB. Therefore, we'd like to extend our GraphQL listings query to support filtering by a query and hook it up to our search box.

See `screenshot_with_search.png`.

Note: You may want to consider throttling the requests so every key down doesn't trigger another query.

### 3. Add support for neighborhood score

We'd like to compute the neighbourhood score of each neighbourhood and attach it to the listing so we can get an idea of how people rated the neigbourhood.

To get the neighbourhood score, we will compute the average `review_scores_location` of each listing in the same neighbourhood of the listing (note: not all listings have a `review_scores_location`). If there are fewer than 5 listings, we will show "N/A" to signify we don't have enough data.

This data will then be piped to the cards (as seen in `screenshot.png`)

## Assessment Criteria

The final project will be assessed on:

* Functionality: Does the application work without any bugs?
* Code Quality: Is the additional code well-written and easy to understand?
* Testing/Documentation: Are the more complex parts of the app properly tested and documented?
* Performance: Does the application work reasonably fast? (You don't have to optimize it, but it should operate without any significant lag)
