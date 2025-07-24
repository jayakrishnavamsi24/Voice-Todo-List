# Voice-Controlled To-Do List Application

A modern, responsive to-do list application that combines traditional task management with voice input capabilities. Built with vanilla JavaScript, this application provides an intuitive user experience with speech recognition, dark/light theme support, and persistent data storage.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5ff0d821-7445-4aa0-8cfd-acae8cf5028d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2909b02d-0b01-473e-9bdc-b0bece7f7224" />


## Live Link: 
https://voice-todo-list-new.vercel.app/

## Features

### Core Functionality
- **Voice Input**: Add tasks using speech recognition
- **Manual Input**: Traditional text input for task creation
- **Task Management**: Mark tasks as complete/incomplete, delete individual tasks
- **Bulk Operations**: Clear all completed tasks at once
- **Persistent Storage**: Automatic saving to browser's localStorage

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Toggle between light and dark modes
- **Real-time Statistics**: Track total, completed, and remaining tasks
- **Keyboard Shortcuts**: Quick access to common actions
- **Error Handling**: Comprehensive error messages and fallback options

### Accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Clear visual indicators for all states
- **Focus Management**: Proper focus handling throughout the application

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: Web Speech API for voice recognition
- **Storage**: Browser localStorage for data persistence
- **Architecture**: Object-oriented JavaScript with class-based structure

## Browser Compatibility

### Supported Browsers
- **Chrome**: Full support (recommended)
- **Edge**: Full support
- **Firefox**: Limited voice support
- **Safari**: Limited voice support

### Requirements
- Modern browser with ES6+ support
- Microphone access for voice features
- localStorage support for data persistence

## Installation and Setup

### Option 1: Direct Download
1. Clone or download the repository
2. Open `index.html` in a web browser
3. Allow microphone access when prompted

### Option 2: Local Server
1. Clone the repository:
   ```bash
   git clone https://github.com/jayakrishnavamsi24/Voice-Todo-List.git
   cd Voice-Todo-List
   ```

2. Serve the files using a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with live-server)
   npx live-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

## Usage Guide

### Adding Tasks

#### Voice Input
1. Click the "Start Listening" button or press the spacebar
2. Speak your task clearly when the listening indicator appears
3. The task will be automatically added when recognition completes

#### Manual Input
1. Type your task in the input field
2. Click "Add Task" or press Enter
3. The task will be added to your list

### Managing Tasks

#### Completing Tasks
- Click the checkbox next to any task to mark it as complete
- Completed tasks will be visually distinguished with strikethrough text

#### Deleting Tasks
- Click the delete button (trash icon) next to any task
- Individual tasks are removed immediately
- Use "Clear Completed" to remove all finished tasks at once

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Spacebar | Toggle voice recognition |
| Escape | Stop voice listening |
| Ctrl/Cmd + D | Toggle dark/light theme |
| Enter | Add task (when input field is focused) |

### Theme Switching
- Click the theme toggle button in the header
- Use Ctrl/Cmd + D keyboard shortcut
- Theme preference is automatically saved

## Project Structure

```
voice-todo-app/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and themes
├── script.js           # JavaScript application logic
└── README.md           # Project documentation
```

## Code Architecture

### Main Class: VoiceTodoApp
The application is built around a single main class that encapsulates all functionality:

#### Key Methods
- `init()`: Initialize the application and setup components
- `initSpeechRecognition()`: Configure Web Speech API
- `addTask()`: Add new tasks to the list
- `toggleTask()`: Toggle task completion status
- `deleteTask()`: Remove individual tasks
- `renderTasks()`: Update the UI with current tasks
- `saveToStorage()`/`loadFromStorage()`: Handle data persistence

#### Event Handling
- Speech recognition events (start, result, error, end)
- User interface events (clicks, keyboard input)
- Application lifecycle events (page load, visibility changes)

## Data Storage

### localStorage Schema
```javascript
{
  "tasks": [
    {
      "id": "unique-id",
      "text": "Task description",
      "completed": false,
      "createdAt": "2025-07-24T12:00:00.000Z",
      "completedAt": null
    }
  ],
  "theme": "light",
  "lastSaved": "2025-07-24T12:00:00.000Z"
}
```

### Data Management
- Automatic saving on every change
- Error handling for storage failures
- Data validation on load
- Backup and export capabilities

## Performance Considerations

### Optimization Features
- Minimal DOM manipulation
- Event delegation for dynamic content
- Efficient task rendering
- Lazy loading of speech recognition
- Memory management for event listeners

### Best Practices
- Debounced user input
- Error boundaries for API failures
- Graceful degradation for unsupported features
- Progressive enhancement approach

## Security Features

### XSS Prevention
- HTML escaping for user-generated content
- Content Security Policy ready
- Input sanitization

### Privacy
- No external data transmission
- Local-only data storage
- No tracking or analytics

## Troubleshooting

### Common Issues

#### Voice Recognition Not Working
- Ensure microphone permissions are granted
- Check browser compatibility
- Verify internet connection (required for speech processing)
- Try refreshing the page

#### Tasks Not Saving
- Check if localStorage is enabled
- Verify sufficient storage space
- Look for browser restrictions in private/incognito mode

#### Performance Issues
- Clear browser cache
- Check for JavaScript errors in console
- Ensure sufficient system memory

### Debug Tools
Access debug functions via browser console:
```javascript
// Get application statistics
window.debugVoiceTodo.getStats()

// Export tasks as JSON
window.debugVoiceTodo.exportTasks()

// Add sample tasks for testing
window.debugVoiceTodo.addSampleTasks()

// Clear all data
window.debugVoiceTodo.clearAll()
```

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across browsers
5. Submit a pull request

### Code Standards
- Follow ES6+ JavaScript standards
- Use semantic HTML
- Maintain CSS organization
- Include comprehensive comments
- Ensure accessibility compliance

### Testing Checklist
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Voice recognition functionality
- [ ] Keyboard navigation
- [ ] Data persistence
- [ ] Error handling
- [ ] Performance optimization

## License

This project is open source and you can use it in your daily life :)

## Support

For issues, questions, or contributions, please visit the project repository or create an issue on GitHub.

---

**Note**: This application requires microphone access for voice features. Speech recognition accuracy may vary based on background noise, accent, and browser implementation.
