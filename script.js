$(document).ready(function() {
  $('#examForm').on('submit', function(e) {
      e.preventDefault();

      const examTopic = $('#examTopic').val();
      const subtopics = $('#subtopics').val().split(',');
      const numQuestions = $('#numQuestions').val();

      $.ajax({
          url: '/generateQuestions',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ examTopic, subtopics, numQuestions }),
          success: function(data) {
              $('#result').html(data.replace(/\n/g, '<br>'));
          }
      });
  });
});
