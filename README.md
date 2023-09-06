# nodejs-communities-apis
SaaS Platform that enables user to make their communities and add members to it.

##### ALL API Endpoints ######

1] Role
----------------------------
Name	    |      URL
----------------------------
Create	  |   POST /v1/role
Get All	  |   GET /v1/role
-----------------------------

2] User
-----------------------------------
Name	     |         URL
-----------------------------------
Sign Up	   |    POST /v1/auth/signup
Sign in	   |    POST /v1/auth/signin
Get Me	   |    GET /v1/auth/me
------------------------------------

3] Community
----------------------------------------------------------------
Name        	           |             URL
----------------------------------------------------------------
Create	                 |     POST /v1/community
Get All	                 |     GET /v1/community
Get All Members	         |     GET /v1/community/:id/members
Get My Owned Community	 |     GET /v1/community/me/owner
Get My Joined Community	 |     GET /v1/community/me/member
------------------------------------------------------------------

4] Member
------------------------------------------
Name	         |       URL
------------------------------------------
Add Member	   |  POST /v1/member
Remove Member	 |  DELETE /v1/member/:id
-------------------------------------------
