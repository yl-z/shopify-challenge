setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

ratings <- read.table("title.ratings.tsv", header=TRUE,
                     sep="\t", row.names="tconst")

# Exploratory plots
hist(ratings$averageRating)
boxplot(ratings$averageRating)

hist(log(ratings$numVotes))
boxplot(log(ratings$numVotes))

smoothScatter(ratings$averageRating, log(ratings$numVotes))
smoothScatter(ratings$averageRating, (ratings$numVotes))

# Density Estimates
ratingsAvg = density(ratings$averageRating, bw = 0.15, from=0, to=10, na.rm=TRUE)
plot(ratingsAvg)

logNumVotes = density(log(ratings$numVotes), bw = 0.2, from=0, na.rm=TRUE)
plot(logNumVotes)

#Write estimates to file
length(ratingsAvg$x)
length(logNumVotes$x)

estimates = matrix(c(ratingsAvg$x,
                      ratingsAvg$y, 
                      logNumVotes$x, 
                      logNumVotes$y), ncol = 4)

estimatesJSON <- toJSON(estimates)
write_json(estimatesJSON, "ratings.json")
