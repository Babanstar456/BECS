import pandas as pd

# Sample data
data = [
    {
        "name": "Ceiling Fan A1",
        "category": "Fans",
        "price": 2499,
        "imglink": "ceilingfanA1.jpg",
        "description": "Efficient ceiling fan with high-speed motor.",
        "subcat": "3-blade"
    },
    {
        "name": "LED Tube Light",
        "category": "Lighting",
        "price": 599,
        "imglink": "ledtube.jpg",
        "description": "Energy-saving LED tube light with bright output.",
        "subcat": "LED"
    },
    {
        "name": "Electric Iron B2",
        "category": "Appliances",
        "price": 1299,
        "imglink": "ironB2.jpg",
        "description": "Lightweight electric iron with non-stick soleplate.",
        "subcat": "Dry Iron"
    }
]

# Convert to DataFrame
df = pd.DataFrame(data)

# Save to Excel
df.to_excel("Electrical_Items_Sample.xlsx", index=False)
print("✅ Electrical_Items_Sample.xlsx generated successfully!")
