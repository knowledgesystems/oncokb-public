package org.mskcc.cbio.oncokb.service.impl;

import static org.mskcc.cbio.oncokb.config.Constants.MAX_SERVICE_ACCOUNT_TOKENS;
import static org.mskcc.cbio.oncokb.config.cache.CompanyCacheResolver.COMPANIES_BY_ID_CACHE;
import static org.mskcc.cbio.oncokb.config.cache.CompanyCacheResolver.COMPANIES_BY_NAME_CACHE;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.mskcc.cbio.oncokb.config.cache.CacheNameResolver;
import org.mskcc.cbio.oncokb.domain.Company;
import org.mskcc.cbio.oncokb.domain.Token;
import org.mskcc.cbio.oncokb.domain.User;
import org.mskcc.cbio.oncokb.domain.UserDetails;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseStatus;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseType;
import org.mskcc.cbio.oncokb.domain.enumeration.TokenType;
import org.mskcc.cbio.oncokb.repository.CompanyRepository;
import org.mskcc.cbio.oncokb.repository.UserDetailsRepository;
import org.mskcc.cbio.oncokb.repository.UserRepository;
import org.mskcc.cbio.oncokb.security.AuthoritiesConstants;
import org.mskcc.cbio.oncokb.security.uuid.TokenProvider;
import org.mskcc.cbio.oncokb.service.CompanyDomainService;
import org.mskcc.cbio.oncokb.service.CompanyService;
import org.mskcc.cbio.oncokb.service.UserDetailsService;
import org.mskcc.cbio.oncokb.service.UserService;
import org.mskcc.cbio.oncokb.service.dto.CompanyDTO;
import org.mskcc.cbio.oncokb.service.dto.UserDTO;
import org.mskcc.cbio.oncokb.service.mapper.CompanyDomainMapper;
import org.mskcc.cbio.oncokb.service.mapper.CompanyMapper;
import org.mskcc.cbio.oncokb.service.mapper.UserDetailsMapper;
import org.mskcc.cbio.oncokb.service.mapper.UserMapper;
import org.mskcc.cbio.oncokb.web.rest.errors.TooManyTokensException;
import org.mskcc.cbio.oncokb.web.rest.vm.CompanyVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.mskcc.cbio.oncokb.config.cache.CompanyCacheResolver.COMPANIES_BY_ID_CACHE;
import static org.mskcc.cbio.oncokb.config.cache.CompanyCacheResolver.COMPANIES_BY_NAME_CACHE;

/**
 * Service Implementation for managing {@link Company}.
 */
@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final Logger log = LoggerFactory.getLogger(CompanyServiceImpl.class);

    private final CompanyRepository companyRepository;

    private final CompanyMapper companyMapper;

    private final UserMapper userMapper;

    private final UserService userService;

    private final UserDetailsService userDetailsService;

    private final UserDetailsMapper userDetailsMapper;

    private final CacheManager cacheManager;

    private final CacheNameResolver cacheNameResolver;

    private final UserRepository userRepository;

    private final UserDetailsRepository userDetailsRepository;

    private final TokenProvider tokenProvider;

    public CompanyServiceImpl(
        CompanyRepository companyRepository,
        CompanyMapper companyMapper,
        CompanyDomainService companyDomainService,
        CompanyDomainMapper companyDomainMapper,
        UserService userService,
        UserDetailsService userDetailsService,
        UserDetailsMapper userDetailsMapper,
        UserMapper userMapper,
        CacheManager cacheManager,
        CacheNameResolver cacheNameResolver,
        UserRepository userRepository,
        UserDetailsRepository userDetailsRepository,
        TokenProvider tokenProvider
    ) {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
        this.userMapper = userMapper;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.userDetailsMapper = userDetailsMapper;
        this.cacheManager = cacheManager;
        this.cacheNameResolver = cacheNameResolver;
        this.userRepository = userRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public CompanyDTO createCompany(CompanyDTO companyDTO) {
        log.debug("Request to save Company : {}", companyDTO);
        Company company = companyMapper.toEntity(companyDTO);
        company = companyRepository.save(company);

        this.clearCompanyCaches(company);
        return companyMapper.toDto(company);
    }

    @Override
    public CompanyDTO updateCompany(CompanyVM companyVm) {
        log.debug("Request to save Company : {}", companyVm);

        Optional<Company> oldCompany = companyRepository.findById(companyVm.getId());
        Boolean isLicenseUpdateRequired = false;
        if(oldCompany.isPresent()){
            // When there is a change in license status, we need to re-update user's license as well
            isLicenseUpdateRequired = oldCompany.get().getLicenseStatus() != companyVm.getLicenseStatus();
        }

        Company company = companyRepository.save(companyMapper.toEntity(companyVm));

        // Update the licenses for current users of the company
        List<UserDTO> companyUsers = userService.getCompanyUsers(company.getId());
        if(isLicenseUpdateRequired){
            companyUsers.forEach(userDTO -> userService.updateUserWithCompanyLicense(userDTO, company, false, false));
        }else{
            companyUsers.forEach(userDTO -> userService.updateUserAndTokens(userDTO));
        }

        // Update the licenses for new users being added to this company
        if(companyVm.getCompanyUserEmails() != null){
            companyVm.getCompanyUserEmails()
                .stream()
                .map(email -> userService.getUserWithAuthoritiesByEmailIgnoreCase(email))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(user -> userMapper.userToUserDTO(user))
                .forEach(userDTO -> userService.updateUserWithCompanyLicense(userDTO, company, true, false));
        }

        this.clearCompanyCaches(company);
        return companyMapper.toDto(company);
    }

    /**
     * Check whether the license status change is supported.
     * @param oldLicenseStatus
     * @param newLicenseStatus
     * @return true if the license status change is valid
     */
    @Override
    public boolean verifyLicenseStatusChange(LicenseStatus oldLicenseStatus, LicenseStatus newLicenseStatus) {
        switch(oldLicenseStatus) {
            case REGULAR:
                return !newLicenseStatus.equals(LicenseStatus.TRIAL_EXPIRED);
            case TRIAL:
                break;
            case TRIAL_EXPIRED:
                return !newLicenseStatus.equals(LicenseStatus.EXPIRED);
            case EXPIRED:
                return !newLicenseStatus.equals(LicenseStatus.TRIAL_EXPIRED);
            case UNKNOWN:
                break;
            default:
                return false;
        }
        return true;
    }


    @Override
    @Transactional(readOnly = true)
    public List<CompanyDTO> findAll() {
        log.debug("Request to get all Companies");
        return companyRepository.findAll().stream()
            .map(companyMapper::toDto)
            .map(companyDTO -> {
                companyDTO.setNumberOfUsers(userService.getCompanyUsers(companyDTO.getId()).size());
                return companyDTO;
            })
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CompanyDTO> findOne(Long id) {
        log.debug("Request to get Company : {}", id);
        return companyRepository.findById(id)
            .map(companyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CompanyDTO> findOneByNameIgnoreCase(String name) {
        log.debug("Request to get Company by name: {}", name);
        return companyRepository.findOneByNameIgnoreCase(name).map(company -> companyMapper.toDto(company));
    }

    @Override
    @Transactional()
    public void delete(Long id) {
        log.debug("Request to delete Company : {}", id);
        Optional<CompanyDTO> maybeCompanyDTO = this.findOne(id);
        if (!maybeCompanyDTO.isPresent()) {
            throw new EmptyResultDataAccessException("No class org.mskcc.cbio.oncokb.domain.Company entity with id " + id + " exists!", 0);
        }

        CompanyDTO companyDTO = maybeCompanyDTO.get();
        Optional<UserDTO> serviceUser = getServiceUserForCompany(companyDTO.getId());
        if (serviceUser.isPresent()) {
            userService.deleteUser(serviceUser.get().getLogin());
        }

        Boolean isCommercial = companyDTO.getLicenseType().equals(LicenseType.COMMERCIAL);
        List<UserDetails> userDetails = userDetailsRepository.findByCompanyId(id);
        for (UserDetails userDetail : userDetails) {
            userDetail.setCompany(null);
        }

        if (isCommercial) {
            List<User> users = userDetails.stream().map(UserDetails::getUser).collect(Collectors.toList());
            for (User user : users) {
                user.setActivated(false);
            }
            userRepository.saveAll(users);
        }

        userDetailsRepository.saveAll(userDetails);
        companyRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Optional<User> createServiceAccount(Long id) {
        Optional<CompanyDTO> companyDtoOptional = findOne(id);
        if (!companyDtoOptional.isPresent()) {
            return Optional.empty();
        }

        CompanyDTO companyDTO = companyDtoOptional.get();
        Company company = companyMapper.toEntity(companyDTO);
        Optional<UserDTO> serviceUser = getServiceUserForCompany(company.getId());
        // only allow one service user per company
        if (serviceUser.isPresent()) {
            return Optional.empty();
        }
        UserDTO userDTO = new UserDTO();
        userDTO = new UserDTO();
        userDTO.setFirstName(company.getName());
        userDTO.setLastName(UUID.randomUUID().toString());
        userDTO.setLogin(UUID.randomUUID().toString());
        userDTO.setActivated(true);
        userDTO.setLicenseType(company.getLicenseType());
        userDTO.setAuthorities(new HashSet<>(Arrays.asList(AuthoritiesConstants.ROLE_SERVICE_ACCOUNT)));
        userDTO.setCompany(companyDTO);

        return Optional.of(userService.createUser(userDTO, true, Optional.empty(), Optional.of(false)));
    }

    @Override
    @Transactional
    public void deleteServiceAccount(CompanyDTO companyDTO) {
        Company company = companyMapper.toEntity(companyDTO);
        Optional<UserDTO> serviceUser = getServiceUserForCompany(company.getId());
        if (serviceUser.isPresent()) {
            userService.deleteUser(serviceUser.get().getLogin());
        }
    }

    @Override
    @Transactional
    public Optional<Token> createServiceAccountToken(Long id, String name) throws TooManyTokensException {
        Optional<CompanyDTO> companyDtoOptional = findOne(id);
        if (!companyDtoOptional.isPresent()) {
            return Optional.empty();
        }

        Company company = companyMapper.toEntity(companyDtoOptional.get());
        Optional<UserDTO> serviceUserOptional = getServiceUserForCompany(company.getId());
        UserDTO serviceUserDTO;
        if (serviceUserOptional.isPresent()) {
            serviceUserDTO = serviceUserOptional.get();
        } else {
            createServiceAccount(company.getId());
            serviceUserOptional = getServiceUserForCompany(company.getId());
            if (serviceUserOptional.isPresent()) {
                serviceUserDTO = serviceUserOptional.get();
            } else {
                return Optional.empty();
            }
        }

        User serviceUser = userMapper.userDTOToUser(serviceUserDTO);
        List<Token> tokens = tokenProvider.getUserTokens(serviceUser);
        if (tokens.size() >= MAX_SERVICE_ACCOUNT_TOKENS) {
            throw new TooManyTokensException();
        }

        return Optional.of(tokenProvider.createToken(
            serviceUser,
            TokenType.SERVICE,
            Optional.of(
                LocalDateTime.of(9999, 1, 1, 0, 0).atZone(ZoneId.systemDefault()).toInstant()
            ),
            Optional.of(true),
            Optional.of(name)
        ));
    }

    private void clearCompanyCaches(Company company) {
        Objects.requireNonNull(cacheManager.getCache(this.cacheNameResolver.getCacheName(COMPANIES_BY_ID_CACHE))).evict(company.getId());
        Objects.requireNonNull(cacheManager.getCache(this.cacheNameResolver.getCacheName(COMPANIES_BY_NAME_CACHE))).evict(company.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDTO> findCompaniesByIds(List<Long> ids) {
        log.debug("Request to get Company : {}", ids);
        return companyRepository.findCompaniesByIds(ids)
            .stream()
            .map(companyMapper::toDto)
            .collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public Optional<List<Token>> getServiceAccountTokensForCompany(Long id) {
        Optional<CompanyDTO> companyDtoOptional = findOne(id);
        if (companyDtoOptional.isPresent()) {
            CompanyDTO companyDto = companyDtoOptional.get();
            List<Token> tokens = new ArrayList<>();
            Optional<UserDTO> serviceUser = getServiceUserForCompany(companyDto.getId());
            if (serviceUser.isPresent()) {
                tokens.addAll(tokenProvider.getUserTokens(userMapper.userDTOToUser(serviceUser.get())));
            } else {
                return Optional.empty();
            }
            return Optional.of(tokens);
        } 
        return Optional.empty();
    }

    public Optional<UserDTO> getServiceUserForCompany(Long companyId) {
        List<UserDTO> companyUsers = userService.getCompanyUsers(companyId);
        for (UserDTO user : companyUsers) {
            if (user.getAuthorities().contains(AuthoritiesConstants.ROLE_SERVICE_ACCOUNT)) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
}
