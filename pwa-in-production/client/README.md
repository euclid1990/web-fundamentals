# PWA App

## Yahoo Weather API

```sql
select * from weather.forecast where woeid in (SELECT woeid FROM geo.places WHERE text="(latitude,longitude)")
```

```json
Tokyo: (35.689487, 139.691711)
Hanoi: (21.027763, 105.834160)
```
