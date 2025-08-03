package com.loanmanagement.service;

import com.loanmanagement.dto.LoanTypeDto;
import com.loanmanagement.model.LoanType;
import com.loanmanagement.repository.LoanTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminLoanTypeService {

    private final LoanTypeRepository loanTypeRepository;

    public List<LoanTypeDto> getAllLoanTypes() {
        return loanTypeRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public LoanTypeDto getLoanTypeById(Long id) {
        LoanType type = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));
        return convertToDto(type);
    }

    public LoanTypeDto createLoanType(LoanTypeDto dto) {
        LoanType type = LoanType.builder()
                .name(dto.getName())
                .interestRate(dto.getInterestRate())
                .requirements(dto.getRequirements())
                .maxTenureYears(dto.getMaxTenureYears())
                .maxLoanAmount(dto.getMaxLoanAmount())
                .penaltyRatePercent(dto.getPenaltyRatePercent())
                .build();
        loanTypeRepository.save(type);
        dto.setLoanTypeId(type.getLoanTypeId());
        return dto;
    }

    public LoanTypeDto updateLoanType(Long id, LoanTypeDto dto) {
        LoanType existing = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        existing.setName(dto.getName());
        existing.setInterestRate(dto.getInterestRate());
        existing.setRequirements(dto.getRequirements());
        existing.setMaxTenureYears(dto.getMaxTenureYears());
        existing.setMaxLoanAmount(dto.getMaxLoanAmount());
        existing.setPenaltyRatePercent(dto.getPenaltyRatePercent());

        loanTypeRepository.save(existing);
        return convertToDto(existing);
    }

    public void deleteLoanType(Long id) {
        LoanType existing = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));
        loanTypeRepository.delete(existing);
    }

    // ✅ New: Update config fields only (name, requirements, tenure, max amount)
    public LoanTypeDto updateLoanTypeConfig(Long id, LoanTypeDto dto) {
        LoanType existing = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        existing.setName(dto.getName());
        existing.setRequirements(dto.getRequirements());
        existing.setMaxLoanAmount(dto.getMaxLoanAmount());
        existing.setMaxTenureYears(dto.getMaxTenureYears());

        loanTypeRepository.save(existing);
        return convertToDto(existing);
    }

    // ✅ New: Update only interest & penalty rates
    public LoanTypeDto updateInterestAndPenaltyRates(Long id, LoanTypeDto dto) {
        LoanType existing = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        existing.setInterestRate(dto.getInterestRate());
        existing.setPenaltyRatePercent(dto.getPenaltyRatePercent());

        loanTypeRepository.save(existing);
        return convertToDto(existing);
    }

    // 🔁 DTO conversion helper
    private LoanTypeDto convertToDto(LoanType loanType) {
        return LoanTypeDto.builder()
                .loanTypeId(loanType.getLoanTypeId())
                .name(loanType.getName())
                .interestRate(loanType.getInterestRate())
                .requirements(loanType.getRequirements())
                .maxTenureYears(loanType.getMaxTenureYears())
                .maxLoanAmount(loanType.getMaxLoanAmount())
                .penaltyRatePercent(loanType.getPenaltyRatePercent())
                .build();
    }
}
