# Animation & Design Quick Reference Guide

## 🎨 Font Stack

```css
/* Body Text */
font-family: Poppins (300, 400, 500, 600)

/* Headlines */
font-family: Montserrat (300-800)
```

## ✨ Animation Classes

### Basic Animations

| Class | Effect | Duration | Use Case |
|-------|--------|----------|----------|
| `animate-fade-in` | Fade + slide up | 0.6s | Page sections, cards |
| `animate-slide-in-left` | Slide from left | 0.6s | Form fields, list items |
| `animate-slide-in-right` | Slide from right | 0.6s | Alternating content |
| `animate-scale-in` | Zoom in | 0.5s | Modals, popups |
| `animate-float` | Gentle up/down | 3s infinite | Logos, icons |
| `animate-gradient-shift` | Moving gradient | 8s infinite | Backgrounds, text |

### Delay Classes

```css
animation-delay-100  /* 100ms */
animation-delay-200  /* 200ms */
animation-delay-300  /* 300ms */
animation-delay-400  /* 400ms */
animation-delay-500  /* 500ms */
animation-delay-600  /* 600ms */
```

### Usage Example

```jsx
<div className="animate-fade-in animation-delay-200">
  Content appears after 200ms
</div>
```

## 🎯 Component Patterns

### Animated Card

```jsx
<Card className="animate-scale-in animation-delay-100 opacity-0"
      style={{animationFillMode: 'forwards'}}>
  <CardContent>...</CardContent>
</Card>
```

### Gradient Button

```jsx
<Button className="bg-gradient-to-r from-primary to-purple-600 
                   hover:from-primary/90 hover:to-purple-600/90 
                   text-white border-0 shadow-xl 
                   hover:shadow-primary/50">
  Click Me
</Button>
```

### Gradient Text

```jsx
<h1 className="bg-gradient-to-r from-primary to-purple-600 
               bg-clip-text text-transparent">
  Headline Text
</h1>
```

### Glass Effect

```jsx
<div className="glass text-white border-white/20">
  Glassmorphism content
</div>
```

## 🎨 Color Gradients

### Primary Gradient
```
from-primary to-purple-600
```

### Hero Gradient
```
from-blue-400 via-purple-400 to-pink-400
```

### CTA Gradient
```
from-primary via-purple-600 to-pink-600
```

### Background Gradient
```
from-primary/10 via-purple-500/10 to-pink-500/10
```

## 🔄 Interactive States

### Hover Effects

| Element | Hover State |
|---------|-------------|
| Button | `-translate-y-0.5`, `shadow-lg`, `scale-95` on active |
| Card | `-translate-y-1`, `shadow-xl`, `border-primary/50` |
| Input | `border-primary/50` |
| Icon | `scale-110`, `rotate-6` |

### Focus States

| Element | Focus State |
|---------|-------------|
| Input | `ring-2 ring-primary`, `border-primary` |
| Button | `ring-2 ring-ring ring-offset-2` |

## 📱 Responsive Animation

### Staggered Entrance

```jsx
{items.map((item, index) => (
  <Card 
    key={item.id}
    className="animate-scale-in opacity-0"
    style={{
      animationDelay: `${(index + 1) * 100}ms`,
      animationFillMode: 'forwards'
    }}
  >
    {item.content}
  </Card>
))}
```

## 🎭 Page-Specific Patterns

### Landing Page Hero

```jsx
<section className="relative overflow-hidden">
  {/* Background image with zoom on hover */}
  <Image className="transition-transform duration-[5000ms] hover:scale-105" />
  
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70" />
  
  {/* Content with staggered animations */}
  <h1 className="animate-fade-in">Title</h1>
  <p className="animate-fade-in animation-delay-200 opacity-0" 
     style={{animationFillMode: 'forwards'}}>
    Description
  </p>
</section>
```

### Auth Pages

```jsx
<div className="bg-gradient-to-br from-background via-primary/5 to-purple-500/5">
  {/* Pattern overlay */}
  <div className="absolute inset-0 bg-[url(...)] opacity-50" />
  
  {/* Floating logo */}
  <Logo className="animate-float" />
  
  {/* Animated card */}
  <Card className="animate-scale-in shadow-2xl" />
</div>
```

### Feature Cards

```jsx
<Card className="group hover:-translate-y-1">
  <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 
                  group-hover:scale-110 group-hover:rotate-6">
    <Icon className="group-hover:scale-110" />
  </div>
</Card>
```

## 🚀 Performance Tips

1. **Use transform/opacity for animations** - GPU accelerated
2. **Avoid animating width/height** - Causes layout reflow
3. **Use will-change sparingly** - Only for complex animations
4. **Respect prefers-reduced-motion** - Accessibility consideration

## 🎨 Design Tokens

### Spacing
- Consistent padding: `p-6`, `px-4`, `py-2`
- Gap sizes: `gap-4`, `gap-8`, `space-x-2`

### Typography
- Headline sizes: `text-3xl md:text-4xl lg:text-5xl`
- Body text: `text-base md:text-lg`
- Font weights: `font-light`, `font-medium`, `font-bold`
- Tracking: `tracking-tight` for headlines

### Shadows
- Small: `shadow-sm`
- Medium: `shadow-lg`
- Large: `shadow-xl`, `shadow-2xl`
- Colored: `hover:shadow-primary/50`

### Borders
- Default: `border`
- Hover: `hover:border-primary/50`
- Radius: `rounded-md`, `rounded-lg`, `rounded-full`

## 💡 Best Practices

1. **Stagger animations** for sequential content
2. **Use opacity-0** with `animationFillMode: 'forwards'`
3. **Group hover effects** with `group` class
4. **Combine transitions** with `transition-all duration-300`
5. **Test on multiple devices** for performance
6. **Maintain consistency** in animation timing
7. **Don't over-animate** - subtle is better

## 📚 Common Combinations

### Card with Icon
```jsx
<Card className="group animate-scale-in">
  <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 
                  transition-all duration-300 
                  group-hover:scale-110 group-hover:rotate-6">
    <Icon className="transition-transform duration-300 
                     group-hover:scale-110" />
  </div>
</Card>
```

### Form Field
```jsx
<FormItem className="animate-slide-in-left animation-delay-200">
  <FormLabel className="font-medium">Label</FormLabel>
  <Input className="font-light hover:border-primary/50 
                    focus-visible:ring-primary" />
</FormItem>
```

### CTA Section
```jsx
<section className="bg-gradient-to-br from-primary/10 via-purple-500/10 
                    to-pink-500/10 animate-gradient-shift">
  <h2 className="animate-fade-in">
    Call to <span className="bg-gradient-to-r from-primary to-purple-600 
                           bg-clip-text text-transparent">Action</span>
  </h2>
  <Button className="bg-gradient-to-r from-primary to-purple-600 
                     shadow-2xl hover:shadow-primary/50">
    Get Started
  </Button>
</section>
```

