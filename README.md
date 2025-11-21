# 🔧 screepsmod-fast-build

Modifies Screeps server constants **construction costs** and **controller progression**, with:
- Automatic persistence
- Live CLI modification
- `constants reload` for applying changes without full restart
- Ability to return to **vanilla Screeps defaults**

---

## 📦 Installation

```bash
npm install screepsmod-custom-constants
```

## Default Modifications

Reduces construction costs and upgrade requirements by a factor of 10

### Examples

#### Construction Costs
`Extensions: (3,000) -> 300`

`Roads: (300) -> 30`

`Observers: (8,000) -> 800`

#### Upgrade requirements

`Controller Level 2->3: (45,000) -> 4,500`

`Controller Level 5->6: (1,215,000) -> 121,500`

`Controller Level 7->8: (10,935,000) -> 1,093,500`

## CLI Commands


#### Get the current value
  
`constants get CONSTRUCTION_COST.spawn`


#### Get all constants
  
`constants get`


#### Change a value
  
`constants set CONSTRUCTION_COST.spawn 2000`

(Values must be valid JSON (e.g. numbers, strings, arrays, objects)


#### Apply modified values immediately (hot reload)
  
`constants reload`

#### Restore original Screeps default Values
`constants reset`



