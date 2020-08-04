### role pioneers

-   spawn units assigned to a resource.

### role homestead

-   spawn units assigned to resource closest to spawn.
-   early on spawn is probably going to be full and no units will need to be spawned. have units upgrade controller when spawn is full.

### events to handle

-   expand to neutral territory for harvesting
-   expand to enemy territory for harvesting
-   respond to enemy units in territory (create antibody units)

### tips to adapt

-   TIP OF THE DAY: Inscreasing the reusePath option in the Creep.moveTo method helps saving CPU.

### pitfalls to remember

-   A room is visible if you have a creep or an owned structure in it. (so when you no longer have creeps in a neutral or opponent's room, your query for that room in Games.rooms just fails, and seems to come out of nowhere.)
-   Flags have many purposes in game. Because they are considered a player-owned object and their location is stored in memory, players often use them to mark sources for remote mining to allow creeps to navigate outside the room when using Game.getObjectById() would return NULL because the player does not have vision.
-   would need to have unit travel into another room by exit, flag resources there, and keep the count and flag reference instead of resource references.
-   so the allocator must save all terrain information, even though it seems to be more usefully to run the query each time, instead its extrememly brittle and must be dynamically maintained only when units are present in an adjacent room.
