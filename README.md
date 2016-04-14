# G.L.I.M.R.
##### Git Log Inferred Metrics and Reports

```npm install glimr```
``` require('glimr'); ```

##### CLI
```node glimr-cli <project_key> <file_containing_logs> <start UNIX epoch OR 0 for all> <end UNIX epoch OR 0 for all> ```


#### WHY GLIMR???

Most organizations tend to abuse story points and measure productivity in frankly ridiculous ways (e.g. lines of code).  
Even though story points measure complexity and are a trailing metric they’re used for prediction and treated as time.  Velocity is a sum of guesses which are never revisited or rexamined.  Velocity isn't bad, but it tends to be used improperly.  The truth behind the scenes is lost at the water cooler or simply never investigated.  Assumptions that built velocity reports are treated as facts and it is difficult to see the why behind velocity trends.

I’ve worked for many different companies as a software engineer and I’m convinced that even in the best environments there are usually only two conclusions that management arrives at from velocity:

 - Velocity is up = the team is working hard and is super smart
 - Velocity is down = the team is lazy and dumb

GLIMR is a tool that uses real data to easily and plainly show the most truth surrounding velocity.  GLIMR does this because it:

 - Gives insight into productivity and team/project health
    - When are people committing?
    - Turnover, hiring, firing inferred from commit authors
    - Rework by detecting multiple merges
    - Infer estimation practices from changes in commits per story point over time
 - Incentivizes good and compliant practices:
    - Bad -> Linking lines of code to performance encourages poor practices.
    - Good -> Linking commit frequency and commit message compliance to performance encourages good practices.
 - Avoids any barriers to transparency (needs minimal access rights.  If you can run git log, you can see the GLIMR data)
 - Avoids any barriers to use
    - It is completely agnostic (barring git)
    - Does not need access to multiple organizational systems.  Can be run locally in milliseconds.

## Outputs:

#### glimr_results_all.json
    ```
    {
    "logObjects": 
        [{
            "commit": HASH,
            "author": { "name": STRING,"email":STRING },
            "date": JS_DATE_STRING,
            "message": STRING,
            "pullRequest": { "isPullRequest": BOOLEAN, "number": INT, -1 },
            "deltas": {  "msSinceLast": REAL, "rollingAverageMs": REAL, "rollingStDevMs": REAL }
        }, ...],
    "cards":
        [{
            "key": STRING,
            "number": INT,
            "projectKey": STRING,
            "numberOfPullRequests": INT,
            "commits": [...]
        }, ...],
    "authors": 
        [{
           "name": STRING,
           "email": STRING,
           "activity": {
               "commits": [HASH,...],
               "contribution": {
                   "total": INT,
                   "totalCommitsByAll": INT,
                   "fractionOfContribution": REAL
               }
           }
        }, ...],
    "counts":
        "counts": {
            "commits": INT,
            "cards": INT,
            "pullRequests": INT
        }
    }
    ```
        
#### Break down files of glimr_results_all.json:
    - glimr_results_authors.csv
    - glimr_results_authors.json
    - glimr_results_cards.csv
    - glimr_results_cards.json
    - glimr_results_logs.csv
    - glimr_results_logs.json
