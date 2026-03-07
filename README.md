קישור לאתר - https://valeriarusakova.github.io/project-2/#/
קישור GitHub - https://github.com/ValeriaRusakova/project-2 
# Cryptonite - Cryptocurrency Tracking App

אפליקציה למעקב אחר מטבעות וירטואליים בזמן אמת.

## תיאור הפרויקט

Cryptonite היא אפליקציית React לניהול ומעקב אחר מטבעות קריפטוגרפיים. האפליקציה מאפשרת צפייה ב-100 המטבעות המובילים, בחירת מטבעות למעקב, צפייה בגרפים בזמן אמת וקבלת המלצות AI להשקעה.

## תכונות עיקריות

- **דף הבית**: הצגת 100 מטבעות עם חיפוש, מחירים ב-3 מטבעות (USD, EUR, ILS)
- **בחירת מטבעות**: אפשרות לבחור עד 5 מטבעות למעקב באמצעות Switch
- **דו"ח זמן אמת**: גרף נרות (Candlestick) המתעדכן כל שנייה
- **המלצות AI**: ניתוח מטבע והמלצה לקנייה/מכירה עם נתונים מפורטים
- **דף אודות**: מידע על הפרויקט והמפתחת

## טכנולוגיות

- **React 19** + **TypeScript**
- **Redux Toolkit** - ניהול state
- **React Router** - ניווט בין דפים
- **Recharts** - גרפים ותרשימים
- **Vite** - build tool

## APIs

- **CoinGecko API** - רשימת מטבעות ונתונים מפורטים
- **CryptoCompare API** - מחירים בזמן אמת

## התקנה והרצה

```bash
# התקנת dependencies
npm install

# הרצה בסביבת פיתוח
npm run dev

# בנייה לייצור
npm run build
```

## מבנה הפרויקט

```
src/
├── App.tsx          # קומפוננטה ראשית + routing
├── store.ts         # Redux store
├── Navbar.tsx       # תפריט ניווט
├── Header.tsx       # כותרת עם Parallax
├── CoinCard.tsx     # כרטיס מטבע
├── CoinList.tsx     # רשימת מטבעות
├── MoreInfo.tsx     # מידע נוסף (מחירים)
├── Dialog.tsx       # דיאלוג החלפת מטבע
├── HomePage.tsx     # דף הבית
├── ReportsPage.tsx  # דף דוחות
├── RecommendationsPage.tsx  # דף המלצות
├── AboutPage.tsx    # דף אודות
└── App.css          # עיצוב
```

## מפתחת

**Valeria Rusakova**  
Full Stack Web Developer Course
