# Let’s Shyp – Hyperlocal Courier Allocation Backend

[cite_start]This is a Node.js/Express-based backend service designed to handle the end-to-end booking lifecycle for a hyperlocal delivery system[cite: 8, 12].

---

## 🚀 System Design & Reasoning

[cite_start]**Design Approach:** I implemented a service-oriented architecture focusing on a strict **State Machine** to manage order lifecycles: `CREATED` → `ASSIGNED` → `PICKED_UP` → `IN_TRANSIT` → `DELIVERED`[cite: 23, 27]. [cite_start]All courier allocations are deterministic, calculated using the **Manhattan Distance** formula[cite: 37].


[cite_start]**Concurrency Handling:** To prevent race conditions where the same courier is assigned to multiple orders, I utilized MongoDB’s atomic `findOneAndUpdate` operation[cite: 46]. [cite_start]By filtering for `{ isAvailable: true }` during the update, the system ensures that courier assignment is thread-safe and deterministic[cite: 45, 47].

**Scalability Improvement:** In a production environment, I would replace the linear search of couriers with a **Geospatial Index** (like Redis Geo or MongoDB `$near`). [cite_start]This would allow the system to query couriers within a specific radius in $O(\log N)$ time rather than $O(N)$, significantly improving performance as the pool grows[cite: 66].

---

## 🛠 Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install

2. Seed Database: 
   node seed.js

3. Start Server:
   npm start
   (Default: http://localhost:5000)

📖 API Documentation
1. Order Management
   . Create Order
      . POST /api/orders
      . Body: { "pickupLocation": { "x": 0, "y": 0 }, "dropLocation": { "x": 5, "y": 5 }, "deliveryType": "Normal", "packageDetails": "..." }
      . Logic: Automatically finds and assigns the nearest eligible courier.
   
 . Update Status
   . PATCH /api/orders/:orderId/status
   . Body: { "nextStatus": "PICKED_UP" }
   . Validation: Rejects invalid transitions or updates if logical conditions, like courier arrival, are not met.

 . Cancel Order
    . PATCH /api/orders/:orderId/cancel
    . Logic: Releases the courier back to the available pool and sets order to CANCELLED
    
2. Courier Management
   .Update Location (Simulation)
      .PUT /api/couriers/:id/location
      .Body: { "newX": 2, "newY": 2 }
      .Logic: Simulates real-time movement toward pickup and drop locations.

Business Rules Enforced
   .One Courier, One Order: A courier is restricted to handling only one active order at a time.
   .Express Delivery Threshold: Express orders are only assigned if a courier is within a defined distance threshold.
   .Strict Lifecycle: Manual state jumps (e.g., CREATED to DELIVERED) are strictly blocked.

