#!/usr/bin/env ruby
# Translation Verification Script
# 
# This script verifies that all translation files have the correct structure
# and consistent translation keys for the Discourse Timelines plugin.

require 'yaml'

# Expected translation keys and structure
EXPECTED_STRUCTURE = {
  'js' => {
    'timelines' => {
      'composer_toolbar' => {
        'insert_button' => String
      }
    }
  }
}

# Expected translations for each locale
EXPECTED_TRANSLATIONS = {
  'en' => 'Insert Timeline',
  'zh_CN' => '插入时间轴',
  'zh_TW' => '插入時間軌',
  'ja' => 'タイムラインを挿入',
  'es' => 'Insertar línea de tiempo',
  'de' => 'Zeitstrahl einfügen',
  'fr' => 'Insérer une chronologie',
  'ru' => 'Вставить временную шкалу',
  'ko' => '타임라인 삽입'
}

class TranslationVerifier
  def initialize(locales_dir = 'locales')
    @locales_dir = locales_dir
    @errors = []
    @warnings = []
  end

  def verify_all
    puts "=== Discourse Timelines Translation Verification ==="
    puts

    # Find all YAML files in locales directory
    locale_files = Dir.glob(File.join(@locales_dir, '*.yml'))
    
    if locale_files.empty?
      puts "❌ No YAML files found in #{@locales_dir}/"
      return false
    end

    puts "Found #{locale_files.length} locale files:"
    locale_files.each { |file| puts "  - #{File.basename(file)}" }
    puts

    all_valid = true

    locale_files.each do |file|
      locale = File.basename(file, '.yml')
      puts "Verifying #{locale}.yml..."
      
      if verify_file(file, locale)
        puts "✅ #{locale}.yml is valid"
      else
        puts "❌ #{locale}.yml has issues"
        all_valid = false
      end
      puts
    end

    # Check for missing expected locales
    missing_locales = EXPECTED_TRANSLATIONS.keys - locale_files.map { |f| File.basename(f, '.yml') }
    if missing_locales.any?
      puts "⚠️  Missing expected locale files: #{missing_locales.join(', ')}"
    end

    # Summary
    puts "=== Verification Summary ==="
    if all_valid && @errors.empty?
      puts "✅ All translation files are valid!"
    else
      puts "❌ Issues found:"
      @errors.each { |error| puts "  ❌ #{error}" }
    end

    if @warnings.any?
      puts "⚠️  Warnings:"
      @warnings.each { |warning| puts "  ⚠️  #{warning}" }
    end

    all_valid && @errors.empty?
  end

  private

  def verify_file(file_path, locale)
    begin
      content = File.read(file_path, encoding: 'UTF-8')
      data = YAML.safe_load(content)
      
      # Check basic structure
      unless data.is_a?(Hash) && data.key?(locale)
        @errors << "#{locale}: Missing locale key '#{locale}'"
        return false
      end

      locale_data = data[locale]
      
      # Check for js.timelines.composer_toolbar.insert_button structure
      translation_path = %w[js timelines composer_toolbar insert_button]
      current_data = locale_data
      
      translation_path.each do |key|
        unless current_data.is_a?(Hash) && current_data.key?(key)
          @errors << "#{locale}: Missing key path 'js.timelines.composer_toolbar.insert_button'"
          return false
        end
        current_data = current_data[key]
      end

      # Check translation value type
      unless current_data.is_a?(String)
        @errors << "#{locale}: Translation value is not a string"
        return false
      end

      # Check if translation matches expected (if available)
      if EXPECTED_TRANSLATIONS.key?(locale)
        expected = EXPECTED_TRANSLATIONS[locale]
        if current_data != expected
          @warnings << "#{locale}: Translation '#{current_data}' differs from expected '#{expected}'"
        end
      end

      # Check for duplicate keys (old structure without js: prefix)
      if locale_data.key?('timelines') && !locale_data.key?('js')
        @warnings << "#{locale}: Has 'timelines' key but missing 'js' key (possible old structure)"
      end

      # Check YAML syntax and indentation
      if content.include?("\t")
        @errors << "#{locale}: Contains tabs (should use spaces only)"
      end

      # Check for correct encoding
      unless content.valid_encoding?
        @errors << "#{locale}: Invalid encoding detected"
      end

      true
    rescue Psych::SyntaxError => e
      @errors << "#{locale}: YAML syntax error: #{e.message}"
      false
    rescue => e
      @errors << "#{locale}: Error reading file: #{e.message}"
      false
    end
  end
end

# Run verification if script is executed directly
if __FILE__ == $0
  verifier = TranslationVerifier.new
  success = verifier.verify_all
  
  exit(success ? 0 : 1)
end